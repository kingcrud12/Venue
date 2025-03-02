"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestMicroservice = void 0;
const logger_service_1 = require("@nestjs/common/services/logger.service");
const constants_1 = require("@nestjs/core/constants");
const optional_require_1 = require("@nestjs/core/helpers/optional-require");
const injector_1 = require("@nestjs/core/injector/injector");
const nest_application_context_1 = require("@nestjs/core/nest-application-context");
const transport_enum_1 = require("./enums/transport.enum");
const microservices_module_1 = require("./microservices-module");
const server_factory_1 = require("./server/server-factory");
const { SocketModule } = (0, optional_require_1.optionalRequire)('@nestjs/websockets/socket-module', () => require('@nestjs/websockets/socket-module'));
class NestMicroservice extends nest_application_context_1.NestApplicationContext {
    /**
     * Returns an observable that emits status changes.
     */
    get status() {
        return this.serverInstance.status;
    }
    constructor(container, config = {}, graphInspector, applicationConfig) {
        super(container, config);
        this.graphInspector = graphInspector;
        this.applicationConfig = applicationConfig;
        this.logger = new logger_service_1.Logger(NestMicroservice.name, {
            timestamp: true,
        });
        this.microservicesModule = new microservices_module_1.MicroservicesModule();
        this.socketModule = SocketModule ? new SocketModule() : null;
        this.isTerminated = false;
        this.wasInitHookCalled = false;
        this.injector = new injector_1.Injector({ preview: config.preview });
        this.microservicesModule.register(container, this.graphInspector, this.applicationConfig, this.appOptions);
        this.createServer(config);
        this.selectContextModule();
    }
    createServer(config) {
        try {
            if ('useFactory' in config) {
                this.microserviceConfig = this.resolveAsyncOptions(config);
            }
            else {
                this.microserviceConfig = {
                    transport: transport_enum_1.Transport.TCP,
                    ...config,
                };
            }
            if ('strategy' in config) {
                this.serverInstance = config.strategy;
                return;
            }
            else {
                this.serverInstance = server_factory_1.ServerFactory.create(this.microserviceConfig);
            }
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async registerModules() {
        this.socketModule &&
            this.socketModule.register(this.container, this.applicationConfig, this.graphInspector, this.appOptions);
        if (!this.appOptions.preview) {
            this.microservicesModule.setupClients(this.container);
            this.registerListeners();
        }
        this.setIsInitialized(true);
        if (!this.wasInitHookCalled) {
            await this.callInitHook();
            await this.callBootstrapHook();
        }
    }
    registerListeners() {
        this.microservicesModule.setupListeners(this.container, this.serverInstance);
    }
    /**
     * Registers a web socket adapter that will be used for Gateways.
     * Use to override the default `socket.io` library.
     *
     * @param {WebSocketAdapter} adapter
     * @returns {this}
     */
    useWebSocketAdapter(adapter) {
        this.applicationConfig.setIoAdapter(adapter);
        return this;
    }
    /**
     * Registers global exception filters (will be used for every pattern handler).
     *
     * @param {...ExceptionFilter} filters
     */
    useGlobalFilters(...filters) {
        this.applicationConfig.useGlobalFilters(...filters);
        filters.forEach(item => this.graphInspector.insertOrphanedEnhancer({
            subtype: 'filter',
            ref: item,
        }));
        return this;
    }
    /**
     * Registers global pipes (will be used for every pattern handler).
     *
     * @param {...PipeTransform} pipes
     */
    useGlobalPipes(...pipes) {
        this.applicationConfig.useGlobalPipes(...pipes);
        pipes.forEach(item => this.graphInspector.insertOrphanedEnhancer({
            subtype: 'pipe',
            ref: item,
        }));
        return this;
    }
    /**
     * Registers global interceptors (will be used for every pattern handler).
     *
     * @param {...NestInterceptor} interceptors
     */
    useGlobalInterceptors(...interceptors) {
        this.applicationConfig.useGlobalInterceptors(...interceptors);
        interceptors.forEach(item => this.graphInspector.insertOrphanedEnhancer({
            subtype: 'interceptor',
            ref: item,
        }));
        return this;
    }
    useGlobalGuards(...guards) {
        this.applicationConfig.useGlobalGuards(...guards);
        guards.forEach(item => this.graphInspector.insertOrphanedEnhancer({
            subtype: 'guard',
            ref: item,
        }));
        return this;
    }
    async init() {
        if (this.isInitialized) {
            return this;
        }
        await super.init();
        await this.registerModules();
        return this;
    }
    /**
     * Starts the microservice.
     *
     * @returns {void}
     */
    async listen() {
        this.assertNotInPreviewMode('listen');
        !this.isInitialized && (await this.registerModules());
        return new Promise((resolve, reject) => {
            this.serverInstance.listen((err, info) => {
                if (this.microserviceConfig?.autoFlushLogs ?? true) {
                    this.flushLogs();
                }
                if (err) {
                    return reject(err);
                }
                this.logger.log(constants_1.MESSAGES.MICROSERVICE_READY);
                resolve(info);
            });
        });
    }
    /**
     * Terminates the application.
     *
     * @returns {Promise<void>}
     */
    async close() {
        await this.serverInstance.close();
        if (this.isTerminated) {
            return;
        }
        this.setIsTerminated(true);
        await this.closeApplication();
    }
    /**
     * Sets the flag indicating that the application is initialized.
     * @param isInitialized Value to set
     */
    setIsInitialized(isInitialized) {
        this.isInitialized = isInitialized;
    }
    /**
     * Sets the flag indicating that the application is terminated.
     * @param isTerminated Value to set
     */
    setIsTerminated(isTerminated) {
        this.isTerminated = isTerminated;
    }
    /**
     * Sets the flag indicating that the init hook was called.
     * @param isInitHookCalled Value to set
     */
    setIsInitHookCalled(isInitHookCalled) {
        this.wasInitHookCalled = isInitHookCalled;
    }
    /**
     * Registers an event listener for the given event.
     * @param event Event name
     * @param callback Callback to be executed when the event is emitted
     */
    on(event, callback) {
        if ('on' in this.serverInstance) {
            return this.serverInstance.on(event, callback);
        }
        throw new Error('"on" method not supported by the underlying server');
    }
    /**
     * Returns an instance of the underlying server/broker instance,
     * or a group of servers if there are more than one.
     */
    unwrap() {
        if ('unwrap' in this.serverInstance) {
            return this.serverInstance.unwrap();
        }
        throw new Error('"unwrap" method not supported by the underlying server');
    }
    async closeApplication() {
        this.socketModule && (await this.socketModule.close());
        this.microservicesModule && (await this.microservicesModule.close());
        await super.close();
        this.setIsTerminated(true);
    }
    async dispose() {
        if (this.isTerminated) {
            return;
        }
        await this.serverInstance.close();
        this.socketModule && (await this.socketModule.close());
        this.microservicesModule && (await this.microservicesModule.close());
    }
    resolveAsyncOptions(config) {
        const args = config.inject?.map(token => this.get(token, { strict: false }));
        return config.useFactory(...args);
    }
}
exports.NestMicroservice = NestMicroservice;
