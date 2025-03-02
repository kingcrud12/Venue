import { EventEmitter } from 'events';
import { Transport } from '../enums';
import { NatsEvents, NatsStatus } from '../events/nats.events';
import { NatsOptions } from '../interfaces/microservice-configuration.interface';
import { Server } from './server';
type Client = any;
type NatsMsg = any;
/**
 * @publicApi
 */
export declare class ServerNats<E extends NatsEvents = NatsEvents, S extends NatsStatus = NatsStatus> extends Server<E, S> {
    private readonly options;
    readonly transportId = Transport.NATS;
    private natsClient;
    protected statusEventEmitter: EventEmitter<{
        disconnect: [data?: string | number | undefined];
        reconnect: [data?: string | number | undefined];
        update: [data?: string | number | import("../events/nats.events").ServersChangedEvent | undefined];
    }>;
    private readonly subscriptions;
    constructor(options: Required<NatsOptions>['options']);
    listen(callback: (err?: unknown, ...optionalParams: unknown[]) => void): Promise<void>;
    start(callback: (err?: unknown, ...optionalParams: unknown[]) => void): void;
    bindEvents(client: Client): void;
    private waitForGracePeriod;
    close(): Promise<void>;
    createNatsClient(): Promise<Client>;
    getMessageHandler(channel: string): Function;
    handleMessage(channel: string, natsMsg: NatsMsg): Promise<any>;
    getPublisher(natsMsg: NatsMsg, id: string): (response: any) => any;
    handleStatusUpdates(client: Client): Promise<void>;
    unwrap<T>(): T;
    on<EventKey extends keyof E = keyof E, EventCallback extends E[EventKey] = E[EventKey]>(event: EventKey, callback: EventCallback): void;
    protected initializeSerializer(options: NatsOptions['options']): void;
    protected initializeDeserializer(options: NatsOptions['options']): void;
}
export {};
