import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // Définit le chemin de base pour les routes "/users"
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id') // Cette route répondra aux requêtes GET sur "/users/:id"
  async getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id); // Appelle le service pour récupérer l'utilisateur
  }
}