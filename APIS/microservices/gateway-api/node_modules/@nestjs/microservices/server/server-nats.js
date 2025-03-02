"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerNats = void 0;
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const events_1 = require("events");
const constants_1 = require("../constants");
const nats_context_1 = require("../ctx-host/nats.context");
const nats_request_json_deserializer_1 = require("../deserializers/nats-request-json.deserializer");
const enums_1 = require("../enums");
const nats_record_serializer_1 = require("../serializers/nats-record.serializer");
const server_1 = require("./server");
let natsPackage = {};
/**
 * @publicApi
 */
class ServerNats extends server_1.Server {
    constructor(options) {
        super();
        this.options = options;
        this.transportId = enums_1.Transport.NATS;
        this.statusEventEmitter = new events_1.EventEmitter();
        this.subscriptions = [];
        natsPackage = this.loadPackage('nats', ServerNats.name, () => require('nats'));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    async listen(callback) {
        try {
            this.natsClient = await this.createNatsClient();
            this._status$.next("connected" /* NatsStatus.CONNECTED */);
            void this.handleStatusUpdates(this.natsClient);
            this.start(callback);
        }
        catch (err) {
            callback(err);
        }
    }
    start(callback) {
        this.bindEvents(this.natsClient);
        callback();
    }
    bindEvents(client) {
        const subscribe = (channel, queue) => client.subscribe(channel, {
            queue,
            callback: this.getMessageHandler(channel).bind(this),
        });
        const defaultQueue = this.getOptionsProp(this.options, 'queue');
        const registeredPatterns = [...this.messageHandlers.keys()];
        for (const channel of registeredPatterns) {
            const handlerRef = this.messageHandlers.get(channel);
            const queue = handlerRef.extras?.queue ?? defaultQueue;
            const sub = subscribe(channel, queue);
            this.subscriptions.push(sub);
        }
    }
    async waitForGracePeriod() {
        const gracePeriod = this.getOptionsProp(this.options, 'gracePeriod', constants_1.NATS_DEFAULT_GRACE_PERIOD);
        await new Promise(res => {
            setTimeout(() => {
                res();
            }, gracePeriod);
        });
    }
    async close() {
        if (!this.natsClient) {
            return;
        }
        const graceful = this.getOptionsProp(this.options, 'gracefulShutdown');
        if (graceful) {
            this.subscriptions.forEach(sub => sub.unsubscribe());
            await this.waitForGracePeriod();
        }
        await this.natsClient?.close();
        this.statusEventEmitter.removeAllListeners();
        this.natsClient = null;
    }
    createNatsClient() {
        const options = this.options || {};
        return natsPackage.connect({
            servers: constants_1.NATS_DEFAULT_URL,
            ...options,
        });
    }
    getMessageHandler(channel) {
        return async (error, message) => {
            if (error) {
                return this.logger.error(error);
            }
            return this.handleMessage(channel, message);
        };
    }
    async handleMessage(channel, natsMsg) {
        const callerSubject = natsMsg.subject;
        const rawMessage = natsMsg.data;
        const replyTo = natsMsg.reply;
        const natsCtx = new nats_context_1.NatsContext([callerSubject, natsMsg.headers]);
        const message = await this.deserializer.deserialize(rawMessage, {
            channel,
            replyTo,
        });
        if ((0, shared_utils_1.isUndefined)(message.id)) {
            return this.handleEvent(channel, message, natsCtx);
        }
        const publish = this.getPublisher(natsMsg, message.id);
        const handler = this.getHandlerByPattern(channel);
        if (!handler) {
            const status = 'error';
            const noHandlerPacket = {
                id: message.id,
                status,
                err: constants_1.NO_MESSAGE_HANDLER,
            };
            return publish(noHandlerPacket);
        }
        const response$ = this.transformToObservable(await handler(message.data, natsCtx));
        response$ && this.send(response$, publish);
    }
    getPublisher(natsMsg, id) {
        if (natsMsg.reply) {
            return (response) => {
                Object.assign(response, { id });
                const outgoingResponse = this.serializer.serialize(response);
                return natsMsg.respond(outgoingResponse.data, {
                    headers: outgoingResponse.headers,
                });
            };
        }
        // In case the "reply" topic is not provided, there's no need for a reply.
        // Method returns a noop function instead
        return () => { };
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
                    this.logger.error(`NatsError: type: "${status.type}", data: "${data}".`);
                    this._status$.next("disconnected" /* NatsStatus.DISCONNECTED */);
                    this.statusEventEmitter.emit("disconnect" /* NatsEventsMap.DISCONNECT */, status.data);
                    break;
                case 'pingTimer':
                    if (this.options.debug) {
                        this.logger.debug(`NatsStatus: type: "${status.type}", data: "${data}".`);
                    }
                    break;
                case 'reconnecting':
                    this._status$.next("reconnecting" /* NatsStatus.RECONNECTING */);
                    break;
                case 'reconnect':
                    this.logger.log(`NatsStatus: type: "${status.type}", data: "${data}".`);
                    this._status$.next("connected" /* NatsStatus.CONNECTED */);
                    this.statusEventEmitter.emit("reconnect" /* NatsEventsMap.RECONNECT */, status.data);
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
    unwrap() {
        if (!this.natsClient) {
            throw new Error('Not initialized. Please call the "listen"/"startAllMicroservices" method before accessing the server.');
        }
        return this.natsClient;
    }
    on(event, callback) {
        this.statusEventEmitter.on(event, callback);
    }
    initializeSerializer(options) {
        this.serializer = options?.serializer ?? new nats_record_serializer_1.NatsRecordSerializer();
    }
    initializeDeserializer(options) {
        this.deserializer =
            options?.deserializer ?? new nats_request_json_deserializer_1.NatsRequestJSONDeserializer();
    }
}
exports.ServerNats = ServerNats;
