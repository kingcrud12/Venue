/**
 * @publicApi
 */
export declare class NatsRecord<TData = any, THeaders = any> {
    readonly data: TData;
    readonly headers?: THeaders | undefined;
    constructor(data: TData, headers?: THeaders | undefined);
}
/**
 * @publicApi
 */
export declare class NatsRecordBuilder<TData> {
    private data?;
    private headers?;
    constructor(data?: TData | undefined);
    setHeaders<THeaders = any>(headers: THeaders): this;
    setData(data: TData): this;
    build(): NatsRecord;
}
