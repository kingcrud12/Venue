"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerRedis = void 0;
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const constants_1 = require("../constants");
const ctx_host_1 = require("../ctx-host");
const enums_1 = require("../enums");
const server_1 = require("./server");
let redisPackage = {};
/**
 * @publicApi
 */
class ServerRedis extends server_1.Server {
    constructor(options) {
        super();
        this.options = options;
        this.transportId = enums_1.Transport.REDIS;
        this.isManuallyClosed = false;
        this.wasInitialConnectionSuccessful = false;
        this.pendingEventListeners = [];
        redisPackage = this.loadPackage('ioredis', ServerRedis.name, () => require('ioredis'));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    listen(callback) {
        try {
            this.subClient = this.createRedisClient();
            this.pubClient = this.createRedisClient();
            [this.subClient, this.pubClient].forEach((client, index) => {
                const type = index === 0 ? 'pub' : 'sub';
                this.registerErrorListener(client);
                this.registerReconnectListener(client);
                this.registerReadyListener(client);
                this.registerEndListener(client);
                this.pendingEventListeners.forEach(({ event, callback }) => client.on(event, (...args) => callback(type, ...args)));
            });
            this.pendingEventListeners = [];
            this.start(callback);
        }
        catch (err) {
            callback(err);
        }
    }
    start(callback) {
        void Promise.all([this.subClient.connect(), this.pubClient.connect()])
            .then(() => {
            this.bindEvents(this.subClient, this.pubClient);
            callback?.();
        })
            .catch(callback);
    }
    bindEvents(subClient, pubClient) {
        subClient.on(this.options?.wildcards ? 'pmessage' : 'message', this.getMessageHandler(pubClient).bind(this));
        const subscribePatterns = [...this.messageHandlers.keys()];
        subscribePatterns.forEach(pattern => {
            const { isEventHandler } = this.messageHandlers.get(pattern);
            const channel = isEventHandler
                ? pattern
                : this.getRequestPattern(pattern);
            if (this.options?.wildcards) {
                subClient.psubscribe(channel);
            }
            else {
                subClient.subscribe(channel);
            }
        });
    }
    close() {
        this.isManuallyClosed = true;
        this.pubClient && this.pubClient.quit();
        this.subClient && this.subClient.quit();
        this.pendingEventListeners = [];
    }
    createRedisClient() {
        return new redisPackage({
            port: constants_1.REDIS_DEFAULT_PORT,
            host: constants_1.REDIS_DEFAULT_HOST,
            ...this.getClientOptions(),
            lazyConnect: true,
        });
    }
    getMessageHandler(pub) {
        return this.options?.wildcards
            ? (channel, pattern, buffer) => this.handleMessage(channel, buffer, pub, pattern)
            : (channel, buffer) => this.handleMessage(channel, buffer, pub, channel);
    }
    async handleMessage(channel, buffer, pub, pattern) {
        const rawMessage = this.parseMessage(buffer);
        const packet = await this.deserializer.deserialize(rawMessage, { channel });
        const redisCtx = new ctx_host_1.RedisContext([pattern]);
        if ((0, shared_utils_1.isUndefined)(packet.id)) {
            return this.handleEvent(channel, packet, redisCtx);
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
        const response$ = this.transformToObservable(await handler(packet.data, redisCtx));
        response$ && this.send(response$, publish);
    }
    getPublisher(pub, pattern, id) {
        return (response) => {
            Object.assign(response, { id });
            const outgoingResponse = this.serializer.serialize(response);
            return pub.publish(this.getReplyPattern(pattern), JSON.stringify(outgoingResponse));
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
    getRequestPattern(pattern) {
        return pattern;
    }
    getReplyPattern(pattern) {
        return `${pattern}.reply`;
    }
    registerErrorListener(client) {
        client.on("error" /* RedisEventsMap.ERROR */, (err) => this.logger.error(err));
    }
    registerReconnectListener(client) {
        client.on("reconnecting" /* RedisEventsMap.RECONNECTING */, () => {
            if (this.isManuallyClosed) {
                return;
            }
            this._status$.next("reconnecting" /* RedisStatus.RECONNECTING */);
            if (this.wasInitialConnectionSuccessful) {
                this.logger.log('Reconnecting to Redis...');
            }
        });
    }
    registerReadyListener(client) {
        client.on("ready" /* RedisEventsMap.READY */, () => {
            this._status$.next("connected" /* RedisStatus.CONNECTED */);
            this.logger.log('Connected to Redis. Subscribing to channels...');
            if (!this.wasInitialConnectionSuccessful) {
                this.wasInitialConnectionSuccessful = true;
            }
        });
    }
    registerEndListener(client) {
        client.on('end', () => {
            if (this.isManuallyClosed) {
                return;
            }
            this._status$.next("disconnected" /* RedisStatus.DISCONNECTED */);
            this.logger.error('Disconnected from Redis. No further reconnection attempts will be made.');
        });
    }
    getClientOptions() {
        const retryStrategy = (times) => this.createRetryStrategy(times);
        return {
            ...(this.options || {}),
            retryStrategy,
        };
    }
    createRetryStrategy(times) {
        if (this.isManuallyClosed) {
            return undefined;
        }
        if (!this.getOptionsProp(this.options, 'retryAttempts')) {
            this.logger.error('Redis connection closed and retry attempts not specified');
            return;
        }
        if (times > this.getOptionsProp(this.options, 'retryAttempts', 0)) {
            this.logger.error(`Retry time exhausted`);
            return;
        }
        return this.getOptionsProp(this.options, 'retryDelay', 5000);
    }
    unwrap() {
        if (!this.pubClient || !this.subClient) {
            throw new Error('Not initialized. Please call the "listen"/"startAllMicroservices" method before accessing the server.');
        }
        return [this.pubClient, this.subClient];
    }
    on(event, callback) {
        if (this.subClient && this.pubClient) {
            this.subClient.on(event, (...args) => callback('sub', ...args));
            this.pubClient.on(event, (...args) => callback('pub', ...args));
        }
        else {
            this.pendingEventListeners.push({ event, callback });
        }
    }
}
exports.ServerRedis = ServerRedis;
