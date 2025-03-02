import { Module } from '@nestjs/common';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';

// Load environment variables
ConfigModule.forRoot();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

@Controller('prisma-users')
export class PrismaUser {
  @Post()
  async createUser(@Body() body: { name: string; email: string }) {
    const { name, email } = body;
    const user = await prisma.user.create({
      data: { name, email },
    });
    return user;
  }

  @Get()
  async getUsers() {
    const users = await prisma.user.findMany();
    return users;
  }
}
