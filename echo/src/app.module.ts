import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EchoController } from './echo/echo.controller';
import { EchoService } from './echo/echo.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [AuthModule,
	   ],
  controllers: [AppController, EchoController,  UsersController],
  providers: [AppService, EchoService],
})
export class AppModule {}
