import { Logger } from '@nestjs/common/services/logger.service';
import { EventEmitter } from 'events';
import { Observable, ReplaySubject } from 'rxjs';
import { RmqEvents, RmqStatus } from '../events/rmq.events';
import { ReadPacket, RmqOptions, WritePacket } from '../interfaces';
import { ClientProxy } from './client-proxy';
type Channel = any;
type ChannelWrapper = any;
type AmqpConnectionManager = any;
/**
 * @publicApi
 */
export declare class ClientRMQ extends ClientProxy<RmqEvents, RmqStatus> {
    protected readonly options: Required<RmqOptions>['options'];
    protected readonly logger: Logger;
    protected connection$: ReplaySubject<any>;
    protected connectionPromise: Promise<void>;
    protected client: AmqpConnectionManager;
    protected channel: ChannelWrapper;
    protected pendingEventListeners: Array<{
        event: keyof RmqEvents;
        callback: RmqEvents[keyof RmqEvents];
    }>;
    protected isInitialConnect: boolean;
    protected responseEmitter: EventEmitter;
    protected queue: string;
    protected queueOptions: Record<string, any>;
    protected replyQueue: string;
    protected noAssert: boolean;
    constructor(options: Required<RmqOptions>['options']);
    close(): void;
    connect(): Promise<any>;
    createChannel(): Promise<void>;
    createClient(): AmqpConnectionManager;
    mergeDisconnectEvent<T = any>(instance: any, source$: Observable<T>): Observable<T>;
    convertConnectionToPromise(): Promise<any>;
    setupChannel(channel: Channel, resolve: Function): Promise<void>;
    consumeChannel(channel: Channel): Promise<void>;
    registerErrorListener(client: AmqpConnectionManager): void;
    registerDisconnectListener(client: AmqpConnectionManager): void;
    private registerConnectListener;
    on<EventKey extends keyof RmqEvents = keyof RmqEvents, EventCallback extends RmqEvents[EventKey] = RmqEvents[EventKey]>(event: EventKey, callback: EventCallback): void;
    unwrap<T>(): T;
    handleMessage(packet: unknown, callback: (packet: WritePacket) => any): Promise<void>;
    handleMessage(packet: unknown, options: Record<string, unknown>, callback: (packet: WritePacket) => any): Promise<void>;
    protected publish(message: ReadPacket, callback: (packet: WritePacket) => any): () => void;
    protected dispatchEvent(packet: ReadPacket): Promise<any>;
    protected initializeSerializer(options: RmqOptions['options']): void;
    protected mergeHeaders(requestHeaders?: Record<string, string>): Record<string, string> | undefined;
    protected parseMessageContent(content: Buffer): any;
}
export {};
