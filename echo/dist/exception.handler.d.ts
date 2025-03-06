import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    constructor(httpAdapterHost: HttpAdapterHost);
    catch(exception: unknown, host: ArgumentsHost): void;
}
