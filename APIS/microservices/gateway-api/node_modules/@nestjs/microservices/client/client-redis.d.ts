import { Logger } from '@nestjs/common/services/logger.service';
import { RedisEvents, RedisStatus } from '../events/redis.events';
import { ReadPacket, RedisOptions, WritePacket } from '../interfaces';
import { ClientProxy } from './client-proxy';
type Redis = any;
/**
 * @publicApi
 */
export declare class ClientRedis extends ClientProxy<RedisEvents, RedisStatus> {
    protected readonly options: Required<RedisOptions>['options'];
    protected readonly logger: Logger;
    protected readonly subscriptionsCount: Map<string, number>;
    protected pubClient: Redis;
    protected subClient: Redis;
    protected connectionPromise: Promise<any>;
    protected isManuallyClosed: boolean;
    protected wasInitialConnectionSuccessful: boolean;
    protected pendingEventListeners: Array<{
        event: keyof RedisEvents;
        callback: RedisEvents[keyof RedisEvents];
    }>;
    constructor(options: Required<RedisOptions>['options']);
    getRequestPattern(pattern: string): string;
    getReplyPattern(pattern: string): string;
    close(): void;
    connect(): Promise<any>;
    createClient(): Redis;
    registerErrorListener(client: Redis): void;
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
    on<EventKey extends keyof RedisEvents = keyof RedisEvents, EventCallback extends RedisEvents[EventKey] = RedisEvents[EventKey]>(event: EventKey, callback: EventCallback): void;
    unwrap<T>(): T;
    createRetryStrategy(times: number): undefined | number;
    createResponseCallback(): (channel: string, buffer: string) => Promise<void>;
    protected publish(partialPacket: ReadPacket, callback: (packet: WritePacket) => any): () => void;
    protected dispatchEvent(packet: ReadPacket): Promise<any>;
    protected unsubscribeFromChannel(channel: string): void;
}
export {};
