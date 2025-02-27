import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EchoController } from './echo/echo.controller';
import { EchoService } from './echo/echo.service';

@Module({
  imports: [],
  controllers: [AppController, EchoController],
  providers: [AppService, EchoService],
})
export class AppModule {}
