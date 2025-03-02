import { Type } from '@nestjs/common';
import * as net from 'net';
import { Server as NetSocket, Socket } from 'net';
import { TlsOptions } from 'tls';
import { Transport } from '../enums';
import { TcpEvents, TcpStatus } from '../events/tcp.events';
import { TcpSocket } from '../helpers';
import { TcpOptions } from '../interfaces/microservice-configuration.interface';
import { Server } from './server';
/**
 * @publicApi
 */
export declare class ServerTCP extends Server<TcpEvents, TcpStatus> {
    private readonly options;
    readonly transportId = Transport.TCP;
    protected server: NetSocket;
    protected readonly port: number;
    protected readonly host: string;
    protected readonly socketClass: Type<TcpSocket>;
    protected isManuallyTerminated: boolean;
    protected retryAttemptsCount: number;
    protected tlsOptions?: TlsOptions;
    protected pendingEventListeners: Array<{
        event: keyof TcpEvents;
        callback: TcpEvents[keyof TcpEvents];
    }>;
    constructor(options: Required<TcpOptions>['options']);
    listen(callback: (err?: unknown, ...optionalParams: unknown[]) => void): void;
    close(): void;
    bindHandler(socket: Socket): void;
    handleMessage(socket: TcpSocket, rawMessage: unknown): Promise<any>;
    handleClose(): undefined | number | NodeJS.Timer;
    unwrap<T>(): T;
    on<EventKey extends keyof TcpEvents = keyof TcpEvents, EventCallback extends TcpEvents[EventKey] = TcpEvents[EventKey]>(event: EventKey, callback: EventCallback): void;
    protected init(): void;
    protected registerListeningListener(socket: net.Server): void;
    protected registerErrorListener(socket: net.Server): void;
    protected registerCloseListener(socket: net.Server): void;
    protected getSocketInstance(socket: Socket): TcpSocket;
}
