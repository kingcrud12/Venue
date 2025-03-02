import { Logger } from '@nestjs/common/services/logger.service';
import { Observable } from 'rxjs';
import { MqttEvents, MqttStatus } from '../events/mqtt.events';
import { MqttOptions, ReadPacket, WritePacket } from '../interfaces';
import { MqttRecordOptions } from '../record-builders/mqtt.record-builder';
import { ClientProxy } from './client-proxy';
type MqttClient = any;
/**
 * @publicApi
 */
export declare class ClientMqtt extends ClientProxy<MqttEvents, MqttStatus> {
    protected readonly options: Required<MqttOptions>['options'];
    protected readonly logger: Logger;
    protected readonly subscriptionsCount: Map<string, number>;
    protected readonly url: string;
    protected mqttClient: MqttClient | null;
    protected connectionPromise: Promise<any> | null;
    protected isInitialConnection: boolean;
    protected isReconnecting: boolean;
    protected pendingEventListeners: Array<{
        event: keyof MqttEvents;
        callback: MqttEvents[keyof MqttEvents];
    }>;
    constructor(options: Required<MqttOptions>['options']);
    getRequestPattern(pattern: string): string;
    getResponsePattern(pattern: string): string;
    close(): Promise<void>;
    connect(): Promise<any>;
    mergeCloseEvent<T = any>(instance: MqttClient, source$: Observable<T>): Observable<T>;
    createClient(): MqttClient;
    registerErrorListener(client: MqttClient): void;
    registerOfflineListener(client: MqttClient): void;
    registerReconnectListener(client: MqttClient): void;
    registerDisconnectListener(client: MqttClient): void;
    registerCloseListener(client: MqttClient): void;
    registerConnectListener(client: MqttClient): void;
    on<EventKey extends keyof MqttEvents = keyof MqttEvents, EventCallback extends MqttEvents[EventKey] = MqttEvents[EventKey]>(event: EventKey, callback: EventCallback): void;
    unwrap<T>(): T;
    createResponseCallback(): (channel: string, buffer: Buffer) => any;
    protected publish(partialPacket: ReadPacket, callback: (packet: WritePacket) => any): () => void;
    protected dispatchEvent(packet: ReadPacket): Promise<any>;
    protected unsubscribeFromChannel(channel: string): void;
    protected initializeSerializer(options: MqttOptions['options']): void;
    protected mergePacketOptions(requestOptions?: MqttRecordOptions): MqttRecordOptions | undefined;
}
export {};
