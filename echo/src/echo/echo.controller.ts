import { Body, Controller, Get, Post,Request } from '@nestjs/common';

@Controller('venue/api/echo')
export class EchoController {
    @Get()
    echo(@Body() body: any) {
        return body;
    }

    @Post()
    echoPost(@Request() req: any) {
        let date = new Date().toUTCString();
        return { headers: req.headers, body: {"Date":date,...req.body} }; 
    }
}
