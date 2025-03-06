import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost){}
    catch(exception: unknown, host: ArgumentsHost)
    {
        const {httpAdapter} = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Unspecified internal server error';
        let name =  'Error';

        if(exception instanceof Error)
        {
            message = exception.message;
            name = exception.name;
        }
        if(exception instanceof HttpException)
        {
            status = exception.getStatus();
            message = exception.getResponse().toString();
        }
        httpAdapter.reply(ctx.getResponse(), { statusCode:status,name: name, message:message}, status);
    }
}