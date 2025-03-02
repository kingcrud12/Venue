import { LoggerService } from '@nestjs/common/services/logger.service';
import { Observable, ObservedValueOf, ReplaySubject, Subscription } from 'rxjs';
import { BaseRpcContext } from '../ctx-host/base-rpc.context';
import { Transport } from '../enums';
import { ClientOptions, MessageHandler, MicroserviceOptions, MsPattern, ReadPacket, WritePacket } from '../interfaces';
import { ConsumerDeserializer } from '../interfaces/deserializer.interface';
import { ConsumerSerializer } from '../interfaces/serializer.interface';
/**
 * @publicApi
 */
export declare abstract class Server<EventsMap extends Record<string, Function> = Record<string, Function>, Status extends string = string> {
    /**
     * Unique transport identifier.
     */
    readonly transportId?: Transport | symbol;
    protected readonly messageHandlers: Map<string, MessageHandler<any, any, any>>;
    protected readonly logger: LoggerService;
    protected serializer: ConsumerSerializer;
    protected deserializer: ConsumerDeserializer;
    protected _status$: ReplaySubject<Status>;
    /**
     * Returns an observable that emits status changes.
     */
    get status(): Observable<Status>;
    /**
     * Registers an event listener for the given event.
     * @param event Event name
     * @param callback Callback to be executed when the event is emitted
     */
    abstract on<EventKey extends keyof EventsMap = keyof EventsMap, EventCallback extends EventsMap[EventKey] = EventsMap[EventKey]>(event: EventKey, callback: EventCallback): any;
    /**
     * Returns an instance of the underlying server/broker instance,
     * or a group of servers if there are more than one.
     */
    abstract unwrap<T>(): T;
    /**
     * Method called when server is being initialized.
     * @param callback Function to be called upon initialization
     */
    abstract listen(callback: (...optionalParams: unknown[]) => any): any;
    /**
     * Method called when server is being terminated.
     */
    abstract close(): any;
    addHandler(pattern: any, callback: MessageHandler, isEventHandler?: boolean, extras?: Record<string, any>): void;
    getHandlers(): Map<string, MessageHandler>;
    getHandlerByPattern(pattern: string): MessageHandler | null;
    send(stream$: Observable<any>, respond: (data: WritePacket) => Promise<unknown> | void): Subscription;
    handleEvent(pattern: string, packet: ReadPacket, context: BaseRpcContext): Promise<any>;
    transformToObservable<T>(resultOrDeferred: Observable<T> | Promise<T>): Observable<T>;
    transformToObservable<T>(resultOrDeferred: T): never extends Observable<ObservedValueOf<T>> ? Observable<T> : Observable<ObservedValueOf<T>>;
    getOptionsProp<Options extends MicroserviceOptions['options'], Attribute extends keyof Options>(obj: Options, prop: Attribute): Options[Attribute];
    getOptionsProp<Options extends MicroserviceOptions['options'], Attribute extends keyof Options, DefaultValue extends Options[Attribute] = Options[Attribute]>(obj: Options, prop: Attribute, defaultValue: DefaultValue): Required<Options>[Attribute];
    protected handleError(error: string): void;
    protected loadPackage<T = any>(name: string, ctx: string, loader?: Function): T;
    protected initializeSerializer(options: ClientOptions['options']): void;
    protected initializeDeserializer(options: ClientOptions['options']): void;
    /**
     * Transforms the server Pattern to valid type and returns a route for him.
     *
     * @param  {string} pattern - server pattern
     * @returns string
     */
    protected getRouteFromPattern(pattern: string): string;
    protected normalizePattern(pattern: MsPattern): string;
}
