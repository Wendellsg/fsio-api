import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createActivityDto: Prisma.ActivityCreateInput) {
    try {
      await this.prisma.activity.create({
        data: {
          date: new Date(createActivityDto.date),
          comments: createActivityDto.comments,
          effortLevel: createActivityDto.effortLevel,
          painLevel: createActivityDto.painLevel,
          routine: createActivityDto.routine,
        },
      });

      return {
        message: 'Atividade criada com sucesso',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao criar atividade',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, activityId: string) {
    try {
      const activity = await this.prisma.activity.findFirst({
        where: {
          id: activityId,
        },
        select: {
          id: true,
          routine: {
            select: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!activity)
        throw new HttpException(
          'Atividade não encontrada',
          HttpStatus.NOT_FOUND,
        );

      if (activity.routine.user.id !== id)
        throw new HttpException(
          'Usuário não autorizado',
          HttpStatus.UNAUTHORIZED,
        );

      await this.prisma.activity.delete({
        where: {
          id: activityId,
        },
      });

      throw new HttpException('Atividade removida com sucesso', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(
        'Erro ao remover atividade',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
