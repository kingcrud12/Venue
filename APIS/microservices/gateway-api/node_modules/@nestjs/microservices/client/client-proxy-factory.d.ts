import { Transport } from '../enums/transport.enum';
import { ClientKafkaProxy } from '../interfaces';
import { ClientOptions, CustomClientOptions } from '../interfaces/client-metadata.interface';
import { ClientGrpcProxy } from './client-grpc';
import { ClientProxy } from './client-proxy';
export interface IClientProxyFactory {
    create(clientOptions: ClientOptions): ClientProxy;
}
/**
 * @publicApi
 */
export declare class ClientProxyFactory {
    static create(clientOptions: {
        transport: Transport.GRPC;
    } & ClientOptions): ClientGrpcProxy;
    static create(clientOptions: {
        transport: Transport.KAFKA;
    } & ClientOptions): ClientKafkaProxy;
    static create(clientOptions: ClientOptions): ClientProxy;
    static create(clientOptions: CustomClientOptions): ClientProxy;
    private static isCustomClientOptions;
}
