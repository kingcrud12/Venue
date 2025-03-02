"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMqtt = void 0;
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const constants_1 = require("../constants");
const mqtt_context_1 = require("../ctx-host/mqtt.context");
const enums_1 = require("../enums");
const mqtt_record_builder_1 = require("../record-builders/mqtt.record-builder");
const mqtt_record_serializer_1 = require("../serializers/mqtt-record.serializer");
const server_1 = require("./server");
let mqttPackage = {};
/**
 * @publicApi
 */
class ServerMqtt extends server_1.Server {
    constructor(options) {
        super();
        this.options = options;
        this.transportId = enums_1.Transport.MQTT;
        this.pendingEventListeners = [];
        this.url = this.getOptionsProp(options, 'url', constants_1.MQTT_DEFAULT_URL);
        mqttPackage = this.loadPackage('mqtt', ServerMqtt.name, () => require('mqtt'));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    async listen(callback) {
        try {
            this.mqttClient = this.createMqttClient();
            this.start(callback);
        }
        catch (err) {
            callback(err);
        }
    }
    start(callback) {
        this.registerErrorListener(this.mqttClient);
        this.registerReconnectListener(this.mqttClient);
        this.registerDisconnectListener(this.mqttClient);
        this.registerCloseListener(this.mqttClient);
        this.registerConnectListener(this.mqttClient);
        this.pendingEventListeners.forEach(({ event, callback }) => this.mqttClient.on(event, callback));
        this.pendingEventListeners = [];
        this.bindEvents(this.mqttClient);
        this.mqttClient.on("connect" /* MqttEventsMap.CONNECT */, () => callback());
    }
    bindEvents(mqttClient) {
        mqttClient.on('message', this.getMessageHandler(mqttClient).bind(this));
        const registeredPatterns = [...this.messageHandlers.keys()];
        registeredPatterns.forEach(pattern => {
            const { isEventHandler } = this.messageHandlers.get(pattern);
            mqttClient.subscribe(isEventHandler ? pattern : this.getRequestPattern(pattern), this.getOptionsProp(this.options, 'subscribeOptions'));
        });
    }
    close() {
        this.mqttClient && this.mqttClient.end();
        this.pendingEventListeners = [];
    }
    createMqttClient() {
        return mqttPackage.connect(this.url, this.options);
    }
    getMessageHandler(pub) {
        return async (channel, buffer, originalPacket) => this.handleMessage(channel, buffer, pub, originalPacket);
    }
    async handleMessage(channel, buffer, pub, originalPacket) {
        const rawPacket = this.parseMessage(buffer.toString());
        const packet = await this.deserializer.deserialize(rawPacket, { channel });
        const mqttContext = new mqtt_context_1.MqttContext([channel, originalPacket]);
        if ((0, shared_utils_1.isUndefined)(packet.id)) {
            return this.handleEvent(channel, packet, mqttContext);
        }
        const publish = this.getPublisher(pub, channel, packet.id);
        const handler = this.getHandlerByPattern(channel);
        if (!handler) {
            const status = 'error';
            const noHandlerPacket = {
                id: packet.id,
                status,
                err: constants_1.NO_MESSAGE_HANDLER,
            };
            return publish(noHandlerPacket);
        }
        const response$ = this.transformToObservable(await handler(packet.data, mqttContext));
        response$ && this.send(response$, publish);
    }
    getPublisher(client, pattern, id) {
        return (response) => {
            Object.assign(response, { id });
            const options = (0, shared_utils_1.isObject)(response?.data) && response.data instanceof mqtt_record_builder_1.MqttRecord
                ? response.data?.options
                : {};
            delete response?.data?.options;
            const outgoingResponse = this.serializer.serialize(response);
            return client.publish(this.getReplyPattern(pattern), outgoingResponse, options);
        };
    }
    parseMessage(content) {
        try {
            return JSON.parse(content);
        }
        catch (e) {
            return content;
        }
    }
    matchMqttPattern(pattern, topic) {
        const patternSegments = pattern.split(constants_1.MQTT_SEPARATOR);
        const topicSegments = topic.split(constants_1.MQTT_SEPARATOR);
        const patternSegmentsLength = patternSegments.length;
        const topicSegmentsLength = topicSegments.length;
        const lastIndex = patternSegmentsLength - 1;
        for (let i = 0; i < patternSegmentsLength; i++) {
            const currentPattern = patternSegments[i];
            const patternChar = currentPattern[0];
            const currentTopic = topicSegments[i];
            if (!currentTopic && !currentPattern) {
                continue;
            }
            if (!currentTopic && currentPattern !== constants_1.MQTT_WILDCARD_ALL) {
                return false;
            }
            if (patternChar === constants_1.MQTT_WILDCARD_ALL) {
                return i === lastIndex;
            }
            if (patternChar !== constants_1.MQTT_WILDCARD_SINGLE &&
                currentPattern !== currentTopic) {
                return false;
            }
        }
        return patternSegmentsLength === topicSegmentsLength;
    }
    getHandlerByPattern(pattern) {
        const route = this.getRouteFromPattern(pattern);
        if (this.messageHandlers.has(route)) {
            return this.messageHandlers.get(route) || null;
        }
        for (const [key, value] of this.messageHandlers) {
            const keyWithoutSharedPrefix = this.removeHandlerKeySharedPrefix(key);
            if (this.matchMqttPattern(keyWithoutSharedPrefix, route)) {
                return value;
            }
        }
        return null;
    }
    removeHandlerKeySharedPrefix(handlerKey) {
        return handlerKey && handlerKey.startsWith('$share')
            ? handlerKey.split('/').slice(2).join('/')
            : handlerKey;
    }
    getRequestPattern(pattern) {
        return pattern;
    }
    getReplyPattern(pattern) {
        return `${pattern}/reply`;
    }
    registerErrorListener(client) {
        client.on("error" /* MqttEventsMap.ERROR */, (err) => this.logger.error(err));
    }
    registerReconnectListener(client) {
        client.on("reconnect" /* MqttEventsMap.RECONNECT */, () => {
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
            this._status$.next("connected" /* MqttStatus.CONNECTED */);
        });
    }
    unwrap() {
        if (!this.mqttClient) {
            throw new Error('Not initialized. Please call the "listen"/"startAllMicroservices" method before accessing the server.');
        }
        return this.mqttClient;
    }
    on(event, callback) {
        if (this.mqttClient) {
            this.mqttClient.on(event, callback);
        }
        else {
            this.pendingEventListeners.push({ event, callback });
        }
    }
    initializeSerializer(options) {
        this.serializer = options?.serializer ?? new mqtt_record_serializer_1.MqttRecordSerializer();
    }
}
exports.ServerMqtt = ServerMqtt;
