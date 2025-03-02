"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRedis = void 0;
const logger_service_1 = require("@nestjs/common/services/logger.service");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const constants_1 = require("../constants");
const client_proxy_1 = require("./client-proxy");
let redisPackage = {};
/**
 * @publicApi
 */
class ClientRedis extends client_proxy_1.ClientProxy {
    constructor(options) {
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(client_proxy_1.ClientProxy.name);
        this.subscriptionsCount = new Map();
        this.isManuallyClosed = false;
        this.wasInitialConnectionSuccessful = false;
        this.pendingEventListeners = [];
        redisPackage = (0, load_package_util_1.loadPackage)('ioredis', ClientRedis.name, () => require('ioredis'));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    getRequestPattern(pattern) {
        return pattern;
    }
    getReplyPattern(pattern) {
        return `${pattern}.reply`;
    }
    close() {
        this.pubClient && this.pubClient.quit();
        this.subClient && this.subClient.quit();
        this.pubClient = this.subClient = null;
        this.isManuallyClosed = true;
        this.pendingEventListeners = [];
    }
    async connect() {
        if (this.pubClient && this.subClient) {
            return this.connectionPromise;
        }
        this.pubClient = this.createClient();
        this.subClient = this.createClient();
        [this.pubClient, this.subClient].forEach((client, index) => {
            const type = index === 0 ? 'pub' : 'sub';
            this.registerErrorListener(client);
            this.registerReconnectListener(client);
            this.registerReadyListener(client);
            this.registerEndListener(client);
            this.pendingEventListeners.forEach(({ event, callback }) => client.on(event, (...args) => callback(type, ...args)));
        });
        this.pendingEventListeners = [];
        this.connectionPromise = Promise.all([
            this.subClient.connect(),
            this.pubClient.connect(),
        ]);
        await this.connectionPromise;
        return this.connectionPromise;
    }
    createClient() {
        return new redisPackage({
            host: constants_1.REDIS_DEFAULT_HOST,
            port: constants_1.REDIS_DEFAULT_PORT,
            ...this.getClientOptions(),
            lazyConnect: true,
        });
    }
    registerErrorListener(client) {
        client.addListener("error" /* RedisEventsMap.ERROR */, (err) => this.logger.error(err));
    }
    registerReconnectListener(client) {
        client.on("reconnecting" /* RedisEventsMap.RECONNECTING */, () => {
            if (this.isManuallyClosed) {
                return;
            }
            this.connectionPromise = Promise.reject('Error: Connection lost. Trying to reconnect...');
            // Prevent unhandled rejections
            this.connectionPromise.catch(() => { });
            this._status$.next("reconnecting" /* RedisStatus.RECONNECTING */);
            if (this.wasInitialConnectionSuccessful) {
                this.logger.log('Reconnecting to Redis...');
            }
        });
    }
    registerReadyListener(client) {
        client.on("ready" /* RedisEventsMap.READY */, () => {
            this.connectionPromise = Promise.resolve();
            this._status$.next("connected" /* RedisStatus.CONNECTED */);
            this.logger.log('Connected to Redis. Subscribing to channels...');
            if (!this.wasInitialConnectionSuccessful) {
                this.wasInitialConnectionSuccessful = true;
                this.subClient.on('message', this.createResponseCallback());
            }
        });
    }
    registerEndListener(client) {
        client.on('end', () => {
            if (this.isManuallyClosed) {
                return;
            }
            this._status$.next("disconnected" /* RedisStatus.DISCONNECTED */);
            if (this.getOptionsProp(this.options, 'retryAttempts') === undefined) {
                // When retryAttempts is not specified, the connection will not be re-established
                this.logger.error('Disconnected from Redis.');
                // Clean up client instances and just recreate them when connect is called
                this.pubClient = this.subClient = null;
            }
            else {
                this.logger.error('Disconnected from Redis.');
                this.connectionPromise = Promise.reject('Error: Connection lost. Trying to reconnect...');
                // Prevent unhandled rejections
                this.connectionPromise.catch(() => { });
            }
        });
    }
    getClientOptions() {
        const retryStrategy = (times) => this.createRetryStrategy(times);
        return {
            ...(this.options || {}),
            retryStrategy,
        };
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
    unwrap() {
        if (!this.pubClient || !this.subClient) {
            throw new Error('Not initialized. Please call the "connect" method first.');
        }
        return [this.pubClient, this.subClient];
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
            this.logger.error('Retry time exhausted');
            return;
        }
        return this.getOptionsProp(this.options, 'retryDelay', 5000);
    }
    createResponseCallback() {
        return async (channel, buffer) => {
            const packet = JSON.parse(buffer);
            const { err, response, isDisposed, id } = await this.deserializer.deserialize(packet);
            const callback = this.routingMap.get(id);
            if (!callback) {
                return;
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
            const serializedPacket = this.serializer.serialize(packet);
            const responseChannel = this.getReplyPattern(pattern);
            let subscriptionsCount = this.subscriptionsCount.get(responseChannel) || 0;
            const publishPacket = () => {
                subscriptionsCount = this.subscriptionsCount.get(responseChannel) || 0;
                this.subscriptionsCount.set(responseChannel, subscriptionsCount + 1);
                this.routingMap.set(packet.id, callback);
                this.pubClient.publish(this.getRequestPattern(pattern), JSON.stringify(serializedPacket));
            };
            if (subscriptionsCount <= 0) {
                this.subClient.subscribe(responseChannel, (err) => !err && publishPacket());
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
        const serializedPacket = this.serializer.serialize(packet);
        return new Promise((resolve, reject) => this.pubClient.publish(pattern, JSON.stringify(serializedPacket), err => err ? reject(err) : resolve()));
    }
    unsubscribeFromChannel(channel) {
        const subscriptionCount = this.subscriptionsCount.get(channel);
        this.subscriptionsCount.set(channel, subscriptionCount - 1);
        if (subscriptionCount - 1 <= 0) {
            this.subClient.unsubscribe(channel);
        }
    }
}
exports.ClientRedis = ClientRedis;
