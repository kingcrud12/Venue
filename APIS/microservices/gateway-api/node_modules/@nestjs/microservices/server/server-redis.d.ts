import { Transport } from '../enums';
import { RedisEvents, RedisStatus } from '../events/redis.events';
import { RedisOptions } from '../interfaces';
import { Server } from './server';
type Redis = any;
/**
 * @publicApi
 */
export declare class ServerRedis extends Server<RedisEvents, RedisStatus> {
    protected readonly options: Required<RedisOptions>['options'];
    readonly transportId = Transport.REDIS;
    protected subClient: Redis;
    protected pubClient: Redis;
    protected isManuallyClosed: boolean;
    protected wasInitialConnectionSuccessful: boolean;
    protected pendingEventListeners: Array<{
        event: keyof RedisEvents;
        callback: RedisEvents[keyof RedisEvents];
    }>;
    constructor(options: Required<RedisOptions>['options']);
    listen(callback: (err?: unknown, ...optionalParams: unknown[]) => void): void;
    start(callback?: () => void): void;
    bindEvents(subClient: Redis, pubClient: Redis): void;
    close(): void;
    createRedisClient(): Redis;
    getMessageHandler(pub: Redis): (channel: string, pattern: string, buffer: string) => Promise<any>;
    handleMessage(channel: string, buffer: string, pub: Redis, pattern: string): Promise<any>;
    getPublisher(pub: Redis, pattern: any, id: string): (response: any) => any;
    parseMessage(content: any): Record<string, any>;
    getRequestPattern(pattern: string): string;
    getReplyPattern(pattern: string): string;
    registerErrorListener(client: any): void;
    registerReconnectListener(client: {
        on: (event: string, fn: () => void) => void;
    }): void;
    registerReadyListener(client: {
        on: (event: string, fn: () => void) => void;
    }): void;
    registerEndListener(client: {
        on: (event: string, fn: () => void) => void;
    }): void;
    getClientOptions(): Partial<RedisOptions['options']>;
    createRetryStrategy(times: number): undefined | number | void;
    unwrap<T>(): T;
    on<EventKey extends keyof RedisEvents = keyof RedisEvents, EventCallback extends RedisEvents[EventKey] = RedisEvents[EventKey]>(event: EventKey, callback: EventCallback): void;
}
export {};
