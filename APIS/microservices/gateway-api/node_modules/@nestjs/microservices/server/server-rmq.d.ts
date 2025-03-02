import { RmqContext } from '../ctx-host';
import { Transport } from '../enums';
import { RmqEvents, RmqStatus } from '../events/rmq.events';
import { RmqUrl } from '../external/rmq-url.interface';
import { RmqOptions } from '../interfaces';
import { ReadPacket } from '../interfaces/packet.interface';
import { Server } from './server';
type AmqpConnectionManager = any;
type ChannelWrapper = any;
/**
 * @publicApi
 */
export declare class ServerRMQ extends Server<RmqEvents, RmqStatus> {
    protected readonly options: Required<RmqOptions>['options'];
    readonly transportId = Transport.RMQ;
    protected server: AmqpConnectionManager;
    protected channel: ChannelWrapper;
    protected connectionAttempts: number;
    protected readonly urls: string[] | RmqUrl[];
    protected readonly queue: string;
    protected readonly noAck: boolean;
    protected readonly queueOptions: any;
    protected pendingEventListeners: Array<{
        event: keyof RmqEvents;
        callback: RmqEvents[keyof RmqEvents];
    }>;
    constructor(options: Required<RmqOptions>['options']);
    listen(callback: (err?: unknown, ...optionalParams: unknown[]) => void): Promise<void>;
    close(): void;
    start(callback?: (err?: unknown, ...optionalParams: unknown[]) => void): Promise<void>;
    createClient<T = any>(): T;
    private registerConnectListener;
    private registerDisconnectListener;
    setupChannel(channel: any, callback: Function): Promise<void>;
    handleMessage(message: Record<string, any>, channel: any): Promise<void>;
    handleEvent(pattern: string, packet: ReadPacket, context: RmqContext): Promise<any>;
    sendMessage<T = any>(message: T, replyTo: any, correlationId: string): void;
    unwrap<T>(): T;
    on<EventKey extends keyof RmqEvents = keyof RmqEvents, EventCallback extends RmqEvents[EventKey] = RmqEvents[EventKey]>(event: EventKey, callback: EventCallback): void;
    protected initializeSerializer(options: RmqOptions['options']): void;
    private parseMessageContent;
}
export {};
