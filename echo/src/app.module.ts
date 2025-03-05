import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EchoController } from './echo/echo.controller';
import { EchoService } from './echo/echo.service';
import { AuthModule } from './auth/auth.module';
import { PrismaUserController } from './crud';

@Module({
  imports: [AuthModule,
	   TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'localhost',
		port: 5332,
		username: 'database_admin',
		password: process.env.DB_PASSWORD,
		database: 'venue_test',
		autoLoadEntities: true,
		synchronize: true})
	   ],
  controllers: [AppController, EchoController, PrismaUserController],
  providers: [AppService, EchoService],
})
export class AppModule {}
