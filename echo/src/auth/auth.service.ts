import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService){}

	async validateUser(username: string, pass: string): Promise<any>{
		/* TODO : Replace by a DB check */
		if(username === 'user' && pass === 'password'){
			return {userId: 1, username: 'user'};
		}
		return null;
	}
	
	async login(user: any){
		if(await this.validateUser(user.username, user.password) === null){
			return {message: 'User not found'};
		}
		const payload = { username: user.username, sub: user.userId };
		return {
			loggedIn: true,
			access_token: this.jwtService.sign(payload),
		};
	}
}
