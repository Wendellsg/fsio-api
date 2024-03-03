import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EvolutionsService {
  constructor(private prisma: PrismaService) {}

  async create(createEvolutionDto: Prisma.EvolutionCreateInput) {
    try {
      await this.prisma.evolution.create({
        data: createEvolutionDto,
      });
    } catch (error) {
      throw new HttpException('Erro ao criar evolução', error.status || 500);
    }
  }

  async findByPatient(professionalId: string, patientId: string) {
    try {
      return await this.prisma.evolution.findMany({
        where: {
          AND: {
            userId: patientId,
            professionalId: professionalId,
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar agendamentos',
        error.status || 404,
      );
    }
  }

  async update(
    id: string,
    updateEvolutionDto: Prisma.EvolutionUpdateInput,
    professionalId: string,
  ) {
    try {
      if (updateEvolutionDto.professional.connect.id !== professionalId) {
        throw new HttpException('Não autorizado', 401);
      }

      return await this.prisma.evolution.update({
        where: {
          id,
        },
        data: updateEvolutionDto,
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar evolução',
        error.status || 500,
      );
    }
  }

  async remove(id: string, professionalId: string) {
    try {
      const evolution = await this.prisma.evolution.findUnique({
        where: {
          id: id,
        },
      });

      if (!evolution || evolution.professionalId !== professionalId) {
        throw new HttpException('Não autorizado', 401);
      }

      await this.prisma.evolution.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Agendamento removido com sucesso',
      };
    } catch (error) {
      throw new HttpException('Erro ao remover evolução', error.status || 500);
    }
  }
}
