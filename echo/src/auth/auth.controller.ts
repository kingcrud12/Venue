import { Body,Controller, Get,Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Pool } from 'pg';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();
const pool = new Pool({
  user: process.env.DB_USER || 'database_admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'venue_test',
  password: process.env.DB_PASSWORD ,
  port:  5332,
});
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService){
	}
	
	@Post('login')
	async login(@Request() req){
		return this.authService.login(req.body);
	}
	  @Post('/register')
  async createUser(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    /*const result = await pool.query(
      'INSERT INTO account (id_generic) VALUES ($1) RETURNING *',
      [username]
    );*/
    const result = await pool.query(
      'SELECT create_account($1,$2);',
      [username,password]
    );
    return result.rows[0];
  }

  @Get('/list')
  async getUsers() {
    const result = await pool.query('SELECT * FROM account');
    return result.rows;
  }
}
