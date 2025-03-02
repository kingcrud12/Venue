import { Logger } from '@nestjs/common/services/logger.service';
import { KafkaContext } from '../ctx-host';
import { Transport } from '../enums';
import { KafkaStatus } from '../events';
import { BrokersFunction, Consumer, EachMessagePayload, Kafka, Message, Producer, RecordMetadata } from '../external/kafka.interface';
import { KafkaParser } from '../helpers';
import { KafkaOptions, OutgoingResponse, ReadPacket } from '../interfaces';
import { Server } from './server';
/**
 * @publicApi
 */
export declare class ServerKafka extends Server<never, KafkaStatus> {
    protected readonly options: Required<KafkaOptions>['options'];
    readonly transportId = Transport.KAFKA;
    protected logger: Logger;
    protected client: Kafka | null;
    protected consumer: Consumer | null;
    protected producer: Producer | null;
    protected parser: KafkaParser | null;
    protected brokers: string[] | BrokersFunction;
    protected clientId: string;
    protected groupId: string;
    constructor(options: Required<KafkaOptions>['options']);
    listen(callback: (err?: unknown, ...optionalParams: unknown[]) => void): Promise<void>;
    close(): Promise<void>;
    start(callback: () => void): Promise<void>;
    protected registerConsumerEventListeners(): void;
    protected registerProducerEventListeners(): void;
    createClient<T = any>(): T;
    bindEvents(consumer: Consumer): Promise<void>;
    getMessageHandler(): (payload: EachMessagePayload) => Promise<any>;
    getPublisher(replyTopic: string, replyPartition: string, correlationId: string): (data: any) => Promise<RecordMetadata[]>;
    handleMessage(payload: EachMessagePayload): Promise<any>;
    unwrap<T>(): T;
    on<EventKey extends string | number | symbol = string | number | symbol, EventCallback = any>(event: EventKey, callback: EventCallback): void;
    private combineStreamsAndThrowIfRetriable;
    sendMessage(message: OutgoingResponse, replyTopic: string, replyPartition: string | undefined | null, correlationId: string): Promise<RecordMetadata[]>;
    assignIsDisposedHeader(outgoingResponse: OutgoingResponse, outgoingMessage: Message): void;
    assignErrorHeader(outgoingResponse: OutgoingResponse, outgoingMessage: Message): void;
    assignCorrelationIdHeader(correlationId: string, outgoingMessage: Message): void;
    assignReplyPartition(replyPartition: string | null | undefined, outgoingMessage: Message): void;
    handleEvent(pattern: string, packet: ReadPacket, context: KafkaContext): Promise<any>;
    protected initializeSerializer(options: KafkaOptions['options']): void;
    protected initializeDeserializer(options: KafkaOptions['options']): void;
}
