import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';

// Load environment variables
ConfigModule.forRoot();

const prisma = new PrismaClient();

@Controller('api/prisma')
export class UsersController {
  @Post('user/create')
  async createUser(@Body() body: { username: string; password: string }) {
    const { username } = body;
    const user = await prisma.account.create({
      data: { username },
    });
    return user;
  }

  @Get('users/list')
  async getUsers() {
    const users = await prisma.account.findMany();
    return users;
  }
}

