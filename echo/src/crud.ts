import { Module } from '@nestjs/common';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';

// Load environment variables
ConfigModule.forRoot();

const prisma = new PrismaClient();

@Controller('venue/api/prisma/users')
export class PrismaUserController {
  @Post()
  async createUser(@Body() body: { username: string; password: string }) {
    const { username } = body;
    const user = await prisma.account.create({
      data: { username },
    });
    return user;
  }

  @Get()
  async getUsers() {
    const users = await prisma.account.findMany();
    return users;
  }
}
