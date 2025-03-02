"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientKafka = void 0;
const logger_service_1 = require("@nestjs/common/services/logger.service");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const constants_1 = require("../constants");
const kafka_response_deserializer_1 = require("../deserializers/kafka-response.deserializer");
const enums_1 = require("../enums");
const invalid_kafka_client_topic_exception_1 = require("../errors/invalid-kafka-client-topic.exception");
const invalid_message_exception_1 = require("../errors/invalid-message.exception");
const helpers_1 = require("../helpers");
const kafka_request_serializer_1 = require("../serializers/kafka-request.serializer");
const client_proxy_1 = require("./client-proxy");
let kafkaPackage = {};
/**
 * @publicApi
 */
class ClientKafka extends client_proxy_1.ClientProxy {
    get consumer() {
        if (!this._consumer) {
            throw new Error('No consumer initialized. Please, call the "connect" method first.');
        }
        return this._consumer;
    }
    get producer() {
        if (!this._producer) {
            throw new Error('No producer initialized. Please, call the "connect" method first.');
        }
        return this._producer;
    }
    constructor(options) {
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(ClientKafka.name);
        this.client = null;
        this.parser = null;
        this.initialized = null;
        this.responsePatterns = [];
        this.consumerAssignments = {};
        this._consumer = null;
        this._producer = null;
        const clientOptions = this.getOptionsProp(this.options, 'client', {});
        const consumerOptions = this.getOptionsProp(this.options, 'consumer', {});
        const postfixId = this.getOptionsProp(this.options, 'postfixId', '-client');
        this.producerOnlyMode = this.getOptionsProp(this.options, 'producerOnlyMode', false);
        this.brokers = clientOptions.brokers || [constants_1.KAFKA_DEFAULT_BROKER];
        // Append a unique id to the clientId and groupId
        // so they don't collide with a microservices client
        this.clientId =
            (clientOptions.clientId || constants_1.KAFKA_DEFAULT_CLIENT) + postfixId;
        this.groupId = (consumerOptions.groupId || constants_1.KAFKA_DEFAULT_GROUP) + postfixId;
        kafkaPackage = (0, load_package_util_1.loadPackage)('kafkajs', ClientKafka.name, () => require('kafkajs'));
        this.parser = new helpers_1.KafkaParser((options && options.parser) || undefined);
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    subscribeToResponseOf(pattern) {
        const request = this.normalizePattern(pattern);
        this.responsePatterns.push(this.getResponsePatternName(request));
    }
    async close() {
        this._producer && (await this._producer.disconnect());
        this._consumer && (await this._consumer.disconnect());
        this._producer = null;
        this._consumer = null;
        this.initialized = null;
        this.client = null;
    }
    async connect() {
        if (this.initialized) {
            return this.initialized.then(() => this._producer);
        }
        /* eslint-disable-next-line no-async-promise-executor */
        this.initialized = new Promise(async (resolve, reject) => {
            try {
                this.client = this.createClient();
                if (!this.producerOnlyMode) {
                    const partitionAssigners = [
                        (config) => new helpers_1.KafkaReplyPartitionAssigner(this, config),
                    ];
                    const consumerOptions = Object.assign({
                        partitionAssigners,
                    }, this.options.consumer || {}, {
                        groupId: this.groupId,
                    });
                    this._consumer = this.client.consumer(consumerOptions);
                    this.registerConsumerEventListeners();
                    // Set member assignments on join and rebalance
                    this._consumer.on(this._consumer.events.GROUP_JOIN, this.setConsumerAssignments.bind(this));
                    await this._consumer.connect();
                    await this.bindTopics();
                }
                this._producer = this.client.producer(this.options.producer || {});
                this.registerProducerEventListeners();
                await this._producer.connect();
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
        return this.initialized.then(() => this._producer);
    }
    async bindTopics() {
        if (!this._consumer) {
            throw Error('No consumer initialized');
        }
        const consumerSubscribeOptions = this.options.subscribe || {};
        if (this.responsePatterns.length > 0) {
            await this._consumer.subscribe({
                ...consumerSubscribeOptions,
                topics: this.responsePatterns,
            });
        }
        await this._consumer.run(Object.assign(this.options.run || {}, {
            eachMessage: this.createResponseCallback(),
        }));
    }
    createClient() {
        const kafkaConfig = Object.assign({ logCreator: helpers_1.KafkaLogger.bind(null, this.logger) }, this.options.client, { brokers: this.brokers, clientId: this.clientId });
        return new kafkaPackage.Kafka(kafkaConfig);
    }
    createResponseCallback() {
        return async (payload) => {
            const rawMessage = this.parser.parse(Object.assign(payload.message, {
                topic: payload.topic,
                partition: payload.partition,
            }));
            if ((0, shared_utils_1.isUndefined)(rawMessage.headers[enums_1.KafkaHeaders.CORRELATION_ID])) {
                return;
            }
            const { err, response, isDisposed, id } = await this.deserializer.deserialize(rawMessage);
            const callback = this.routingMap.get(id);
            if (!callback) {
                return;
            }
            if (err || isDisposed) {
                return callback({
                    err,
                    response,
                    isDisposed,
                });
            }
            callback({
                err,
                response,
            });
        };
    }
    getConsumerAssignments() {
        return this.consumerAssignments;
    }
    emitBatch(pattern, data) {
        if ((0, shared_utils_1.isNil)(pattern) || (0, shared_utils_1.isNil)(data)) {
            return (0, rxjs_1.throwError)(() => new invalid_message_exception_1.InvalidMessageException());
        }
        const source = (0, rxjs_1.defer)(async () => this.connect()).pipe((0, operators_1.mergeMap)(() => this.dispatchBatchEvent({ pattern, data })));
        const connectableSource = (0, rxjs_1.connectable)(source, {
            connector: () => new rxjs_1.Subject(),
            resetOnDisconnect: false,
        });
        connectableSource.connect();
        return connectableSource;
    }
    commitOffsets(topicPartitions) {
        if (this._consumer) {
            return this._consumer.commitOffsets(topicPartitions);
        }
        else {
            throw new Error('No consumer initialized');
        }
    }
    unwrap() {
        if (!this.client) {
            throw new Error('Not initialized. Please call the "connect" method first.');
        }
        return this.client;
    }
    on(event, callback) {
        throw new Error('Method is not supported for Kafka client');
    }
    registerConsumerEventListeners() {
        if (!this._consumer) {
            return;
        }
        this._consumer.on(this._consumer.events.CONNECT, () => this._status$.next("connected" /* KafkaStatus.CONNECTED */));
        this._consumer.on(this._consumer.events.DISCONNECT, () => this._status$.next("disconnected" /* KafkaStatus.DISCONNECTED */));
        this._consumer.on(this._consumer.events.REBALANCING, () => this._status$.next("rebalancing" /* KafkaStatus.REBALANCING */));
        this._consumer.on(this._consumer.events.STOP, () => this._status$.next("stopped" /* KafkaStatus.STOPPED */));
        this.consumer.on(this._consumer.events.CRASH, () => this._status$.next("crashed" /* KafkaStatus.CRASHED */));
    }
    registerProducerEventListeners() {
        if (!this._producer) {
            return;
        }
        this._producer.on(this._producer.events.CONNECT, () => this._status$.next("connected" /* KafkaStatus.CONNECTED */));
        this._producer.on(this._producer.events.DISCONNECT, () => this._status$.next("disconnected" /* KafkaStatus.DISCONNECTED */));
    }
    async dispatchBatchEvent(packets) {
        if (packets.data.messages.length === 0) {
            return;
        }
        const pattern = this.normalizePattern(packets.pattern);
        const outgoingEvents = await Promise.all(packets.data.messages.map(message => {
            return this.serializer.serialize(message, { pattern });
        }));
        const message = Object.assign({
            topic: pattern,
            messages: outgoingEvents,
        }, this.options.send || {});
        return this.producer.send(message);
    }
    async dispatchEvent(packet) {
        const pattern = this.normalizePattern(packet.pattern);
        const outgoingEvent = await this.serializer.serialize(packet.data, {
            pattern,
        });
        const message = Object.assign({
            topic: pattern,
            messages: [outgoingEvent],
        }, this.options.send || {});
        return this._producer.send(message);
    }
    getReplyTopicPartition(topic) {
        const minimumPartition = this.consumerAssignments[topic];
        if ((0, shared_utils_1.isUndefined)(minimumPartition)) {
            throw new invalid_kafka_client_topic_exception_1.InvalidKafkaClientTopicException(topic);
        }
        // Get the minimum partition
        return minimumPartition.toString();
    }
    publish(partialPacket, callback) {
        const packet = this.assignPacketId(partialPacket);
        this.routingMap.set(packet.id, callback);
        const cleanup = () => this.routingMap.delete(packet.id);
        const errorCallback = (err) => {
            cleanup();
            callback({ err });
        };
        try {
            const pattern = this.normalizePattern(partialPacket.pattern);
            const replyTopic = this.getResponsePatternName(pattern);
            const replyPartition = this.getReplyTopicPartition(replyTopic);
            Promise.resolve(this.serializer.serialize(packet.data, { pattern }))
                .then((serializedPacket) => {
                serializedPacket.headers[enums_1.KafkaHeaders.CORRELATION_ID] = packet.id;
                serializedPacket.headers[enums_1.KafkaHeaders.REPLY_TOPIC] = replyTopic;
                serializedPacket.headers[enums_1.KafkaHeaders.REPLY_PARTITION] =
                    replyPartition;
                const message = Object.assign({
                    topic: pattern,
                    messages: [serializedPacket],
                }, this.options.send || {});
                return this._producer.send(message);
            })
                .catch(err => errorCallback(err));
            return cleanup;
        }
        catch (err) {
            errorCallback(err);
            return () => null;
        }
    }
    getResponsePatternName(pattern) {
        return `${pattern}.reply`;
    }
    setConsumerAssignments(data) {
        const consumerAssignments = {};
        // Only need to set the minimum
        Object.keys(data.payload.memberAssignment).forEach(topic => {
            const memberPartitions = data.payload.memberAssignment[topic];
            if (memberPartitions.length) {
                consumerAssignments[topic] = Math.min(...memberPartitions);
            }
        });
        this.consumerAssignments = consumerAssignments;
    }
    initializeSerializer(options) {
        this.serializer =
            (options && options.serializer) || new kafka_request_serializer_1.KafkaRequestSerializer();
    }
    initializeDeserializer(options) {
        this.deserializer =
            (options && options.deserializer) || new kafka_response_deserializer_1.KafkaResponseDeserializer();
    }
}
exports.ClientKafka = ClientKafka;
