import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST ?? 'localhost',
          port: parseInt(process.env.AUTH_SERVICE_PORT ?? '3001'),
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST ?? 'localhost',
          port: parseInt(process.env.USER_SERVICE_PORT ?? '3002'),
        },
      },
      {
        name: 'POST_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.POST_SERVICE_HOST ?? 'localhost',
          port: parseInt(process.env.PRODUCT_SERVICE_PORT ?? '3003'),
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
