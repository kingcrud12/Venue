import { Transport } from '../enums';
import { MqttEvents, MqttStatus } from '../events/mqtt.events';
import { MessageHandler, PacketId, ReadPacket } from '../interfaces';
import { MqttOptions } from '../interfaces/microservice-configuration.interface';
import { Server } from './server';
type MqttClient = any;
/**
 * @publicApi
 */
export declare class ServerMqtt extends Server<MqttEvents, MqttStatus> {
    private readonly options;
    readonly transportId = Transport.MQTT;
    protected readonly url: string;
    protected mqttClient: MqttClient;
    protected pendingEventListeners: Array<{
        event: keyof MqttEvents;
        callback: MqttEvents[keyof MqttEvents];
    }>;
    constructor(options: Required<MqttOptions>['options']);
    listen(callback: (err?: unknown, ...optionalParams: unknown[]) => void): Promise<void>;
    start(callback: (err?: unknown, ...optionalParams: unknown[]) => void): void;
    bindEvents(mqttClient: MqttClient): void;
    close(): void;
    createMqttClient(): MqttClient;
    getMessageHandler(pub: MqttClient): (channel: string, buffer: Buffer, originalPacket?: Record<string, any>) => Promise<any>;
    handleMessage(channel: string, buffer: Buffer, pub: MqttClient, originalPacket?: Record<string, any>): Promise<any>;
    getPublisher(client: MqttClient, pattern: any, id: string): any;
    parseMessage(content: any): ReadPacket & PacketId;
    matchMqttPattern(pattern: string, topic: string): boolean;
    getHandlerByPattern(pattern: string): MessageHandler | null;
    removeHandlerKeySharedPrefix(handlerKey: string): string;
    getRequestPattern(pattern: string): string;
    getReplyPattern(pattern: string): string;
    registerErrorListener(client: MqttClient): void;
    registerReconnectListener(client: MqttClient): void;
    registerDisconnectListener(client: MqttClient): void;
    registerCloseListener(client: MqttClient): void;
    registerConnectListener(client: MqttClient): void;
    unwrap<T>(): T;
    on<EventKey extends keyof MqttEvents = keyof MqttEvents, EventCallback extends MqttEvents[EventKey] = MqttEvents[EventKey]>(event: EventKey, callback: EventCallback): void;
    protected initializeSerializer(options: MqttOptions['options']): void;
}
export {};
