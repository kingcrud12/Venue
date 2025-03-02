import { Logger } from '@nestjs/common/services/logger.service';
import { EventEmitter } from 'stream';
import { NatsEvents, NatsStatus } from '../events/nats.events';
import { NatsOptions, PacketId, ReadPacket, WritePacket } from '../interfaces';
import { ClientProxy } from './client-proxy';
type Client = Record<string, any>;
type NatsMsg = Record<string, any>;
/**
 * @publicApi
 */
export declare class ClientNats extends ClientProxy<NatsEvents, NatsStatus> {
    protected readonly options: Required<NatsOptions>['options'];
    protected readonly logger: Logger;
    protected natsClient: Client | null;
    protected connectionPromise: Promise<Client> | null;
    protected statusEventEmitter: EventEmitter<{
        disconnect: [data?: string | number | undefined];
        reconnect: [data?: string | number | undefined];
        update: [data?: string | number | import("../events/nats.events").ServersChangedEvent | undefined];
    }>;
    constructor(options: Required<NatsOptions>['options']);
    close(): Promise<void>;
    connect(): Promise<any>;
    createClient(): Promise<Client>;
    handleStatusUpdates(client: Client): Promise<void>;
    on<EventKey extends keyof NatsEvents = keyof NatsEvents, EventCallback extends NatsEvents[EventKey] = NatsEvents[EventKey]>(event: EventKey, callback: EventCallback): void;
    unwrap<T>(): T;
    createSubscriptionHandler(packet: ReadPacket & PacketId, callback: (packet: WritePacket) => any): (error: string | Error | undefined, natsMsg: NatsMsg) => Promise<any>;
    protected publish(partialPacket: ReadPacket, callback: (packet: WritePacket) => any): () => void;
    protected dispatchEvent(packet: ReadPacket): Promise<any>;
    protected initializeSerializer(options: NatsOptions['options']): void;
    protected initializeDeserializer(options: NatsOptions['options']): void;
    protected mergeHeaders<THeaders = any>(requestHeaders?: THeaders): any;
}
export {};
