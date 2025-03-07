import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EchoController } from './echo/echo.controller';
import { EchoService } from './echo/echo.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload/upload.service';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [AuthModule,MulterModule.register({
    dest:'.'
  })
	   ],
  controllers: [AppController, EchoController,  UsersController, UploadController],
  providers: [AppService, EchoService, UploadService],
})
export class AppModule {}
