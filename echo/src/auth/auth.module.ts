import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[
	PassportModule.register({ defaultStrategy: 'jwt' }),
	JwtModule.register({
		secret: process.env.JWT_SECRET || 'secretKey',
		signOptions:{
			expiresIn: '120s',
		},
	}),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
