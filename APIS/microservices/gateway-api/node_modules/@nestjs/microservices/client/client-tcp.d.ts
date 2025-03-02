import { Logger, Type } from '@nestjs/common';
import { ConnectionOptions } from 'tls';
import { TcpEvents, TcpStatus } from '../events/tcp.events';
import { TcpSocket } from '../helpers';
import { ReadPacket, WritePacket } from '../interfaces';
import { TcpClientOptions } from '../interfaces/client-metadata.interface';
import { ClientProxy } from './client-proxy';
/**
 * @publicApi
 */
export declare class ClientTCP extends ClientProxy<TcpEvents, TcpStatus> {
    protected readonly logger: Logger;
    protected readonly port: number;
    protected readonly host: string;
    protected readonly socketClass: Type<TcpSocket>;
    protected readonly tlsOptions?: ConnectionOptions;
    protected socket: TcpSocket | null;
    protected connectionPromise: Promise<any> | null;
    protected pendingEventListeners: Array<{
        event: keyof TcpEvents;
        callback: TcpEvents[keyof TcpEvents];
    }>;
    constructor(options: Required<TcpClientOptions>['options']);
    connect(): Promise<any>;
    handleResponse(buffer: unknown): Promise<void>;
    createSocket(): TcpSocket;
    close(): void;
    registerConnectListener(socket: TcpSocket): void;
    registerErrorListener(socket: TcpSocket): void;
    registerCloseListener(socket: TcpSocket): void;
    handleError(err: any): void;
    handleClose(): void;
    on<EventKey extends keyof TcpEvents = keyof TcpEvents, EventCallback extends TcpEvents[EventKey] = TcpEvents[EventKey]>(event: EventKey, callback: EventCallback): void;
    unwrap<T>(): T;
    protected publish(partialPacket: ReadPacket, callback: (packet: WritePacket) => any): () => void;
    protected dispatchEvent(packet: ReadPacket): Promise<any>;
}
