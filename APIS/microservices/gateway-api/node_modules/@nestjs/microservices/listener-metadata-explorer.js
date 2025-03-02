"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerMetadataExplorer = void 0;
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const constants_1 = require("./constants");
const pattern_handler_enum_1 = require("./enums/pattern-handler.enum");
class ListenerMetadataExplorer {
    constructor(metadataScanner) {
        this.metadataScanner = metadataScanner;
    }
    explore(instance) {
        const instancePrototype = Object.getPrototypeOf(instance);
        return this.metadataScanner
            .getAllMethodNames(instancePrototype)
            .map(method => this.exploreMethodMetadata(instance, instancePrototype, method))
            .filter(metadata => metadata);
    }
    exploreMethodMetadata(instance, instancePrototype, methodKey) {
        const prototypeCallback = instancePrototype[methodKey];
        const handlerType = Reflect.getMetadata(constants_1.PATTERN_HANDLER_METADATA, prototypeCallback);
        if ((0, shared_utils_1.isUndefined)(handlerType)) {
            return;
        }
        const patterns = Reflect.getMetadata(constants_1.PATTERN_METADATA, prototypeCallback);
        const transport = Reflect.getMetadata(constants_1.TRANSPORT_METADATA, prototypeCallback);
        const extras = Reflect.getMetadata(constants_1.PATTERN_EXTRAS_METADATA, prototypeCallback);
        const targetCallback = instance[methodKey];
        return {
            methodKey,
            targetCallback,
            patterns,
            transport,
            extras,
            isEventHandler: handlerType === pattern_handler_enum_1.PatternHandler.EVENT,
        };
    }
    *scanForClientHooks(instance) {
        for (const propertyKey in instance) {
            if ((0, shared_utils_1.isFunction)(propertyKey)) {
                continue;
            }
            const property = String(propertyKey);
            const isClient = Reflect.getMetadata(constants_1.CLIENT_METADATA, instance, property);
            if ((0, shared_utils_1.isUndefined)(isClient)) {
                continue;
            }
            const metadata = Reflect.getMetadata(constants_1.CLIENT_CONFIGURATION_METADATA, instance, property);
            yield { property, metadata };
        }
    }
}
exports.ListenerMetadataExplorer = ListenerMetadataExplorer;
