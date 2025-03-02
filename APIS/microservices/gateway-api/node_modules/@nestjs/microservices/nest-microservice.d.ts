import { CanActivate, ExceptionFilter, INestMicroservice, NestInterceptor, PipeTransform, WebSocketAdapter } from '@nestjs/common';
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { Logger } from '@nestjs/common/services/logger.service';
import { ApplicationConfig } from '@nestjs/core/application-config';
import { NestContainer } from '@nestjs/core/injector/container';
import { GraphInspector } from '@nestjs/core/inspector/graph-inspector';
import { NestApplicationContext } from '@nestjs/core/nest-application-context';
import { AsyncMicroserviceOptions, MicroserviceOptions } from './interfaces/microservice-configuration.interface';
type CompleteMicroserviceOptions = NestMicroserviceOptions & (MicroserviceOptions | AsyncMicroserviceOptions);
export declare class NestMicroservice extends NestApplicationContext<NestMicroserviceOptions> implements INestMicroservice {
    private readonly graphInspector;
    private readonly applicationConfig;
    protected readonly logger: Logger;
    private readonly microservicesModule;
    private readonly socketModule;
    private microserviceConfig;
    private serverInstance;
    private isTerminated;
    private wasInitHookCalled;
    /**
     * Returns an observable that emits status changes.
     */
    get status(): import("rxjs").Observable<string>;
    constructor(container: NestContainer, config: CompleteMicroserviceOptions | undefined, graphInspector: GraphInspector, applicationConfig: ApplicationConfig);
    createServer(config: CompleteMicroserviceOptions): void;
    registerModules(): Promise<any>;
    registerListeners(): void;
    /**
     * Registers a web socket adapter that will be used for Gateways.
     * Use to override the default `socket.io` library.
     *
     * @param {WebSocketAdapter} adapter
     * @returns {this}
     */
    useWebSocketAdapter(adapter: WebSocketAdapter): this;
    /**
     * Registers global exception filters (will be used for every pattern handler).
     *
     * @param {...ExceptionFilter} filters
     */
    useGlobalFilters(...filters: ExceptionFilter[]): this;
    /**
     * Registers global pipes (will be used for every pattern handler).
     *
     * @param {...PipeTransform} pipes
     */
    useGlobalPipes(...pipes: PipeTransform<any>[]): this;
    /**
     * Registers global interceptors (will be used for every pattern handler).
     *
     * @param {...NestInterceptor} interceptors
     */
    useGlobalInterceptors(...interceptors: NestInterceptor[]): this;
    useGlobalGuards(...guards: CanActivate[]): this;
    init(): Promise<this>;
    /**
     * Starts the microservice.
     *
     * @returns {void}
     */
    listen(): Promise<any>;
    /**
     * Terminates the application.
     *
     * @returns {Promise<void>}
     */
    close(): Promise<any>;
    /**
     * Sets the flag indicating that the application is initialized.
     * @param isInitialized Value to set
     */
    setIsInitialized(isInitialized: boolean): void;
    /**
     * Sets the flag indicating that the application is terminated.
     * @param isTerminated Value to set
     */
    setIsTerminated(isTerminated: boolean): void;
    /**
     * Sets the flag indicating that the init hook was called.
     * @param isInitHookCalled Value to set
     */
    setIsInitHookCalled(isInitHookCalled: boolean): void;
    /**
     * Registers an event listener for the given event.
     * @param event Event name
     * @param callback Callback to be executed when the event is emitted
     */
    on(event: string | number | symbol, callback: Function): any;
    /**
     * Returns an instance of the underlying server/broker instance,
     * or a group of servers if there are more than one.
     */
    unwrap<T>(): T;
    protected closeApplication(): Promise<any>;
    protected dispose(): Promise<void>;
    protected resolveAsyncOptions(config: AsyncMicroserviceOptions): MicroserviceOptions;
}
export {};
