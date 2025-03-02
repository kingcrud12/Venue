/**
 * @publicApi
 */
export interface MqttRecordOptions {
    /**
     * The QoS
     */
    qos?: 0 | 1 | 2;
    /**
     * The retain flag
     */
    retain?: boolean;
    /**
     * Whether or not mark a message as duplicate
     */
    dup?: boolean;
    properties?: {
        payloadFormatIndicator?: boolean;
        messageExpiryInterval?: number;
        topicAlias?: number;
        responseTopic?: string;
        correlationData?: Buffer;
        userProperties?: Record<string, string | string[]>;
        subscriptionIdentifier?: number;
        contentType?: string;
    };
}
/**
 * @publicApi
 */
export declare class MqttRecord<TData = any> {
    readonly data: TData;
    options?: MqttRecordOptions | undefined;
    constructor(data: TData, options?: MqttRecordOptions | undefined);
}
/**
 * @publicApi
 */
export declare class MqttRecordBuilder<TData> {
    private data?;
    private options?;
    constructor(data?: TData | undefined);
    setData(data: TData): this;
    setQoS(qos: MqttRecordOptions['qos']): this;
    setRetain(retain: MqttRecordOptions['retain']): this;
    setDup(dup: MqttRecordOptions['dup']): this;
    setProperties(properties: MqttRecordOptions['properties']): this;
    build(): MqttRecord;
}
