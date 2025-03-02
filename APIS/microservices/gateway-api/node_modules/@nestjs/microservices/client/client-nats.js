"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientNats = void 0;
const logger_service_1 = require("@nestjs/common/services/logger.service");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const stream_1 = require("stream");
const constants_1 = require("../constants");
const nats_response_json_deserializer_1 = require("../deserializers/nats-response-json.deserializer");
const empty_response_exception_1 = require("../errors/empty-response.exception");
const nats_record_serializer_1 = require("../serializers/nats-record.serializer");
const client_proxy_1 = require("./client-proxy");
let natsPackage = {};
/**
 * @publicApi
 */
class ClientNats extends client_proxy_1.ClientProxy {
    constructor(options) {
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(ClientNats.name);
        this.natsClient = null;
        this.connectionPromise = null;
        this.statusEventEmitter = new stream_1.EventEmitter();
        natsPackage = (0, load_package_util_1.loadPackage)('nats', ClientNats.name, () => require('nats'));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    async close() {
        await this.natsClient?.close();
        this.statusEventEmitter.removeAllListeners();
        this.natsClient = null;
        this.connectionPromise = null;
    }
    async connect() {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }
        this.connectionPromise = this.createClient();
        this.natsClient = await this.connectionPromise.catch(err => {
            this.connectionPromise = null;
            throw err;
        });
        this._status$.next("connected" /* NatsStatus.CONNECTED */);
        void this.handleStatusUpdates(this.natsClient);
        return this.natsClient;
    }
    createClient() {
        const options = this.options || {};
        return natsPackage.connect({
            servers: constants_1.NATS_DEFAULT_URL,
            ...options,
        });
    }
    async handleStatusUpdates(client) {
        for await (const status of client.status()) {
            const data = status.data && (0, shared_utils_1.isObject)(status.data)
                ? JSON.stringify(status.data)
                : status.data;
            switch (status.type) {
                case 'error':
                    this.logger.error(`NatsError: type: "${status.type}", data: "${data}".`);
                    break;
                case 'disconnect':
                    this.connectionPromise = Promise.reject('Error: Connection lost. Trying to reconnect...');
                    // Prevent unhandled promise rejection
                    this.connectionPromise.catch(() => { });
                    this.logger.error(`NatsError: type: "${status.type}", data: "${data}".`);
                    this._status$.next("disconnected" /* NatsStatus.DISCONNECTED */);
                    this.statusEventEmitter.emit("disconnect" /* NatsEventsMap.DISCONNECT */, status.data);
                    break;
                case 'reconnecting':
                    this._status$.next("reconnecting" /* NatsStatus.RECONNECTING */);
                    break;
                case 'reconnect':
                    this.connectionPromise = Promise.resolve(client);
                    this.logger.log(`NatsStatus: type: "${status.type}", data: "${data}".`);
                    this._status$.next("connected" /* NatsStatus.CONNECTED */);
                    this.statusEventEmitter.emit("reconnect" /* NatsEventsMap.RECONNECT */, status.data);
                    break;
                case 'pingTimer':
                    if (this.options.debug) {
                        this.logger.debug(`NatsStatus: type: "${status.type}", data: "${data}".`);
                    }
                    break;
                case 'update':
                    this.logger.log(`NatsStatus: type: "${status.type}", data: "${data}".`);
                    this.statusEventEmitter.emit("update" /* NatsEventsMap.UPDATE */, status.data);
                    break;
                default:
                    this.logger.log(`NatsStatus: type: "${status.type}", data: "${data}".`);
                    break;
            }
        }
    }
    on(event, callback) {
        this.statusEventEmitter.on(event, callback);
    }
    unwrap() {
        if (!this.natsClient) {
            throw new Error('Not initialized. Please call the "connect" method first.');
        }
        return this.natsClient;
    }
    createSubscriptionHandler(packet, callback) {
        return async (error, natsMsg) => {
            if (error) {
                return callback({
                    err: error,
                });
            }
            const rawPacket = natsMsg.data;
            if (rawPacket?.length === 0) {
                return callback({
                    err: new empty_response_exception_1.EmptyResponseException(this.normalizePattern(packet.pattern)),
                    isDisposed: true,
                });
            }
            const message = await this.deserializer.deserialize(rawPacket);
            if (message.id && message.id !== packet.id) {
                return undefined;
            }
            const { err, response, isDisposed } = message;
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
            const channel = this.normalizePattern(partialPacket.pattern);
            const serializedPacket = this.serializer.serialize(packet);
            const inbox = natsPackage.createInbox(this.options.inboxPrefix);
            const subscriptionHandler = this.createSubscriptionHandler(packet, callback);
            const subscription = this.natsClient.subscribe(inbox, {
                callback: subscriptionHandler,
            });
            const headers = this.mergeHeaders(serializedPacket.headers);
            this.natsClient.publish(channel, serializedPacket.data, {
                reply: inbox,
                headers,
            });
            return () => subscription.unsubscribe();
        }
        catch (err) {
            callback({ err });
            return () => { };
        }
    }
    dispatchEvent(packet) {
        const pattern = this.normalizePattern(packet.pattern);
        const serializedPacket = this.serializer.serialize(packet);
        const headers = this.mergeHeaders(serializedPacket.headers);
        return new Promise((resolve, reject) => {
            try {
                this.natsClient.publish(pattern, serializedPacket.data, {
                    headers,
                });
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    initializeSerializer(options) {
        this.serializer = options?.serializer ?? new nats_record_serializer_1.NatsRecordSerializer();
    }
    initializeDeserializer(options) {
        this.deserializer =
            options?.deserializer ?? new nats_response_json_deserializer_1.NatsResponseJSONDeserializer();
    }
    mergeHeaders(requestHeaders) {
        if (!requestHeaders && !this.options?.headers) {
            return undefined;
        }
        const headers = requestHeaders ?? natsPackage.headers();
        for (const [key, value] of Object.entries(this.options?.headers || {})) {
            if (!headers.has(key)) {
                headers.set(key, value);
            }
        }
        return headers;
    }
}
exports.ClientNats = ClientNats;
