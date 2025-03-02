import { Observable, Observer, ReplaySubject } from 'rxjs';
import { ClientOptions, MsPattern, PacketId, ReadPacket, WritePacket } from '../interfaces';
import { ProducerDeserializer } from '../interfaces/deserializer.interface';
import { ProducerSerializer } from '../interfaces/serializer.interface';
/**
 * @publicApi
 */
export declare abstract class ClientProxy<EventsMap extends Record<never, Function> = Record<never, Function>, Status extends string = string> {
    protected routingMap: Map<string, Function>;
    protected serializer: ProducerSerializer;
    protected deserializer: ProducerDeserializer;
    protected _status$: ReplaySubject<Status>;
    /**
     * Returns an observable that emits status changes.
     */
    get status(): Observable<Status>;
    /**
     * Establishes the connection to the underlying server/broker.
     */
    abstract connect(): Promise<any>;
    /**
     * Closes the underlying connection to the server/broker.
     */
    abstract close(): any;
    /**
     * Registers an event listener for the given event.
     * @param event Event name
     * @param callback Callback to be executed when the event is emitted
     */
    on<EventKey extends keyof EventsMap = keyof EventsMap, EventCallback extends EventsMap[EventKey] = EventsMap[EventKey]>(event: EventKey, callback: EventCallback): void;
    /**
     * Returns an instance of the underlying server/broker instance,
     * or a group of servers if there are more than one.
     */
    abstract unwrap<T>(): T;
    /**
     * Send a message to the server/broker.
     * Used for message-driven communication style between microservices.
     * @param pattern Pattern to identify the message
     * @param data Data to be sent
     * @returns Observable with the result
     */
    send<TResult = any, TInput = any>(pattern: any, data: TInput): Observable<TResult>;
    /**
     * Emits an event to the server/broker.
     * Used for event-driven communication style between microservices.
     * @param pattern Pattern to identify the event
     * @param data Data to be sent
     * @returns Observable that completes when the event is successfully emitted
     */
    emit<TResult = any, TInput = any>(pattern: any, data: TInput): Observable<TResult>;
    protected abstract publish(packet: ReadPacket, callback: (packet: WritePacket) => void): () => void;
    protected abstract dispatchEvent<T = any>(packet: ReadPacket): Promise<T>;
    protected createObserver<T>(observer: Observer<T>): (packet: WritePacket) => void;
    protected serializeError(err: any): any;
    protected serializeResponse(response: any): any;
    protected assignPacketId(packet: ReadPacket): ReadPacket & PacketId;
    protected connect$(instance: any, errorEvent?: string, connectEvent?: string): Observable<any>;
    protected getOptionsProp<Options extends ClientOptions['options'], Attribute extends keyof Options>(obj: Options, prop: Attribute): Options[Attribute];
    protected getOptionsProp<Options extends ClientOptions['options'], Attribute extends keyof Options, DefaultValue extends Options[Attribute] = Options[Attribute]>(obj: Options, prop: Attribute, defaultValue: DefaultValue): Required<Options>[Attribute];
    protected normalizePattern(pattern: MsPattern): string;
    protected initializeSerializer(options: ClientOptions['options']): void;
    protected initializeDeserializer(options: ClientOptions['options']): void;
}
