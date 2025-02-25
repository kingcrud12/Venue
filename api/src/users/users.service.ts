import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { validate as isUUID } from 'uuid'; // Permet de vérifier si l'ID est un UUID valide

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Récupérer un utilisateur par son ID
  async findOne(id: string) {
    // Vérification si l'ID est bien un UUID
    if (!isUUID(id)) {
      throw new BadRequestException(`L'ID fourni (${id}) n'est pas un UUID valide.`);
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        console.error(`[ERREUR] Tentative d'accès à un utilisateur inexistant avec ID: ${id}`);
        throw new NotFoundException(`Utilisateur introuvable.`);
      }

      return user;
    } catch (error) {
      // Gestion des erreurs Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Erreur Prisma:', error);
        throw new InternalServerErrorException(`Une erreur interne est survenue.`);
      }

      throw error; // Propage l'erreur s'il s'agit d'un autre type
    }
  }
}