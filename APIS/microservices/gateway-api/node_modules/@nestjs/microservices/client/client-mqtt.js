"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMqtt = void 0;
const logger_service_1 = require("@nestjs/common/services/logger.service");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const constants_1 = require("../constants");
const mqtt_record_builder_1 = require("../record-builders/mqtt.record-builder");
const mqtt_record_serializer_1 = require("../serializers/mqtt-record.serializer");
const client_proxy_1 = require("./client-proxy");
let mqttPackage = {};
/**
 * @publicApi
 */
class ClientMqtt extends client_proxy_1.ClientProxy {
    constructor(options) {
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(client_proxy_1.ClientProxy.name);
        this.subscriptionsCount = new Map();
        /* eslint-disable @typescript-eslint/no-redundant-type-constituents */
        this.mqttClient = null;
        this.connectionPromise = null;
        this.isInitialConnection = false;
        this.isReconnecting = false;
        this.pendingEventListeners = [];
        this.url = this.getOptionsProp(this.options, 'url') ?? constants_1.MQTT_DEFAULT_URL;
        mqttPackage = (0, load_package_util_1.loadPackage)('mqtt', ClientMqtt.name, () => require('mqtt'));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    getRequestPattern(pattern) {
        return pattern;
    }
    getResponsePattern(pattern) {
        return `${pattern}/reply`;
    }
    async close() {
        if (this.mqttClient) {
            await this.mqttClient.endAsync();
        }
        this.mqttClient = null;
        this.connectionPromise = null;
        this.pendingEventListeners = [];
    }
    connect() {
        if (this.mqttClient) {
            return this.connectionPromise;
        }
        this.mqttClient = this.createClient();
        this.registerErrorListener(this.mqttClient);
        this.registerOfflineListener(this.mqttClient);
        this.registerReconnectListener(this.mqttClient);
        this.registerConnectListener(this.mqttClient);
        this.registerDisconnectListener(this.mqttClient);
        this.registerCloseListener(this.mqttClient);
        this.pendingEventListeners.forEach(({ event, callback }) => this.mqttClient.on(event, callback));
        this.pendingEventListeners = [];
        const connect$ = this.connect$(this.mqttClient);
        this.connectionPromise = (0, rxjs_1.lastValueFrom)(this.mergeCloseEvent(this.mqttClient, connect$).pipe((0, operators_1.share)())).catch(err => {
            if (err instanceof rxjs_1.EmptyError) {
                return;
            }
            throw err;
        });
        return this.connectionPromise;
    }
    mergeCloseEvent(instance, source$) {
        const close$ = (0, rxjs_1.fromEvent)(instance, "close" /* MqttEventsMap.CLOSE */).pipe((0, operators_1.tap)({
            next: () => {
                this._status$.next("closed" /* MqttStatus.CLOSED */);
            },
        }), (0, operators_1.map)((err) => {
            throw err;
        }));
        return (0, rxjs_1.merge)(source$, close$).pipe((0, operators_1.first)());
    }
    createClient() {
        return mqttPackage.connect(this.url, this.options);
    }
    registerErrorListener(client) {
        client.on("error" /* MqttEventsMap.ERROR */, (err) => {
            if (err.code === constants_1.ECONNREFUSED || err.code === constants_1.ENOTFOUND) {
                return;
            }
            this.logger.error(err);
        });
    }
    registerOfflineListener(client) {
        client.on("offline" /* MqttEventsMap.OFFLINE */, () => {
            this.connectionPromise = Promise.reject('Error: Connection lost. Trying to reconnect...');
            // Prevent unhandled rejections
            this.connectionPromise.catch(() => { });
            this.logger.error('MQTT broker went offline.');
        });
    }
    registerReconnectListener(client) {
        client.on("reconnect" /* MqttEventsMap.RECONNECT */, () => {
            this.isReconnecting = true;
            this._status$.next("reconnecting" /* MqttStatus.RECONNECTING */);
            this.logger.log('MQTT connection lost. Trying to reconnect...');
        });
    }
    registerDisconnectListener(client) {
        client.on("disconnect" /* MqttEventsMap.DISCONNECT */, () => {
            this._status$.next("disconnected" /* MqttStatus.DISCONNECTED */);
        });
    }
    registerCloseListener(client) {
        client.on("close" /* MqttEventsMap.CLOSE */, () => {
            this._status$.next("closed" /* MqttStatus.CLOSED */);
        });
    }
    registerConnectListener(client) {
        client.on("connect" /* MqttEventsMap.CONNECT */, () => {
            this.isReconnecting = false;
            this._status$.next("connected" /* MqttStatus.CONNECTED */);
            this.logger.log('Connected to MQTT broker');
            this.connectionPromise = Promise.resolve();
            if (!this.isInitialConnection) {
                this.isInitialConnection = true;
                client.on('message', this.createResponseCallback());
            }
        });
    }
    on(event, callback) {
        if (this.mqttClient) {
            this.mqttClient.on(event, callback);
        }
        else {
            this.pendingEventListeners.push({ event, callback });
        }
    }
    unwrap() {
        if (!this.mqttClient) {
            throw new Error('Not initialized. Please call the "connect" method first.');
        }
        return this.mqttClient;
    }
    createResponseCallback() {
        return async (channel, buffer) => {
            const packet = JSON.parse(buffer.toString());
            const { err, response, isDisposed, id } = await this.deserializer.deserialize(packet);
            const callback = this.routingMap.get(id);
            if (!callback) {
                return undefined;
            }
            if (isDisposed || err) {
                return callback({
                    err,
                    response,
                    isDisposed: true,
                });
            }
            callback({
                err,
                response,
            });
        };
    }
    publish(partialPacket, callback) {
        try {
            const packet = this.assignPacketId(partialPacket);
            const pattern = this.normalizePattern(partialPacket.pattern);
            const responseChannel = this.getResponsePattern(pattern);
            let subscriptionsCount = this.subscriptionsCount.get(responseChannel) || 0;
            const publishPacket = () => {
                subscriptionsCount = this.subscriptionsCount.get(responseChannel) || 0;
                this.subscriptionsCount.set(responseChannel, subscriptionsCount + 1);
                this.routingMap.set(packet.id, callback);
                const options = (0, shared_utils_1.isObject)(packet?.data) && packet.data instanceof mqtt_record_builder_1.MqttRecord
                    ? packet.data.options
                    : undefined;
                delete packet?.data?.options;
                const serializedPacket = this.serializer.serialize(packet);
                this.mqttClient.publish(this.getRequestPattern(pattern), serializedPacket, this.mergePacketOptions(options));
            };
            if (subscriptionsCount <= 0) {
                this.mqttClient.subscribe(responseChannel, (err) => !err && publishPacket());
            }
            else {
                publishPacket();
            }
            return () => {
                this.unsubscribeFromChannel(responseChannel);
                this.routingMap.delete(packet.id);
            };
        }
        catch (err) {
            callback({ err });
            return () => { };
        }
    }
    dispatchEvent(packet) {
        const pattern = this.normalizePattern(packet.pattern);
        const options = (0, shared_utils_1.isObject)(packet?.data) && packet.data instanceof mqtt_record_builder_1.MqttRecord
            ? packet.data.options
            : undefined;
        delete packet?.data?.options;
        const serializedPacket = this.serializer.serialize(packet);
        return new Promise((resolve, reject) => this.mqttClient.publish(pattern, serializedPacket, this.mergePacketOptions(options), (err) => (err ? reject(err) : resolve())));
    }
    unsubscribeFromChannel(channel) {
        const subscriptionCount = this.subscriptionsCount.get(channel);
        this.subscriptionsCount.set(channel, subscriptionCount - 1);
        if (subscriptionCount - 1 <= 0) {
            this.mqttClient.unsubscribe(channel);
        }
    }
    initializeSerializer(options) {
        this.serializer = options?.serializer ?? new mqtt_record_serializer_1.MqttRecordSerializer();
    }
    mergePacketOptions(requestOptions) {
        if (!requestOptions && !this.options?.userProperties) {
            return undefined;
        }
        // Cant just spread objects as MQTT won't deliver
        // any message with empty object as "userProperties" field
        // @url https://github.com/nestjs/nest/issues/14079
        let options = {};
        if (requestOptions) {
            options = { ...requestOptions };
        }
        if (this.options?.userProperties) {
            options.properties = {
                ...options.properties,
                userProperties: {
                    ...this.options?.userProperties,
                    ...options.properties?.userProperties,
                },
            };
        }
        return options;
    }
}
exports.ClientMqtt = ClientMqtt;
