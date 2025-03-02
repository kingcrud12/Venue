import { Logger } from '@nestjs/common/services/logger.service';
import { Observable } from 'rxjs';
import { KafkaStatus } from '../events';
import { BrokersFunction, Consumer, ConsumerGroupJoinEvent, EachMessagePayload, Kafka, Producer, TopicPartitionOffsetAndMetadata } from '../external/kafka.interface';
import { KafkaParser } from '../helpers';
import { ClientKafkaProxy, KafkaOptions, OutgoingEvent, ReadPacket, WritePacket } from '../interfaces';
import { ClientProxy } from './client-proxy';
/**
 * @publicApi
 */
export declare class ClientKafka extends ClientProxy<never, KafkaStatus> implements ClientKafkaProxy {
    protected readonly options: Required<KafkaOptions>['options'];
    protected logger: Logger;
    protected client: Kafka | null;
    protected parser: KafkaParser | null;
    protected initialized: Promise<void> | null;
    protected responsePatterns: string[];
    protected consumerAssignments: {
        [key: string]: number;
    };
    protected brokers: string[] | BrokersFunction;
    protected clientId: string;
    protected groupId: string;
    protected producerOnlyMode: boolean;
    protected _consumer: Consumer | null;
    protected _producer: Producer | null;
    get consumer(): Consumer;
    get producer(): Producer;
    constructor(options: Required<KafkaOptions>['options']);
    subscribeToResponseOf(pattern: unknown): void;
    close(): Promise<void>;
    connect(): Promise<Producer>;
    bindTopics(): Promise<void>;
    createClient<T = any>(): T;
    createResponseCallback(): (payload: EachMessagePayload) => any;
    getConsumerAssignments(): {
        [key: string]: number;
    };
    emitBatch<TResult = any, TInput = any>(pattern: any, data: {
        messages: TInput[];
    }): Observable<TResult>;
    commitOffsets(topicPartitions: TopicPartitionOffsetAndMetadata[]): Promise<void>;
    unwrap<T>(): T;
    on<EventKey extends string | number | symbol = string | number | symbol, EventCallback = any>(event: EventKey, callback: EventCallback): void;
    protected registerConsumerEventListeners(): void;
    protected registerProducerEventListeners(): void;
    protected dispatchBatchEvent<TInput = any>(packets: ReadPacket<{
        messages: TInput[];
    }>): Promise<any>;
    protected dispatchEvent(packet: OutgoingEvent): Promise<any>;
    protected getReplyTopicPartition(topic: string): string;
    protected publish(partialPacket: ReadPacket, callback: (packet: WritePacket) => any): () => void;
    protected getResponsePatternName(pattern: string): string;
    protected setConsumerAssignments(data: ConsumerGroupJoinEvent): void;
    protected initializeSerializer(options: KafkaOptions['options']): void;
    protected initializeDeserializer(options: KafkaOptions['options']): void;
}
