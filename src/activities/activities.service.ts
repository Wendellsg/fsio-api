import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { JwtPayload } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(routineId: string, user: JwtPayload) {
    try {
      const routine = await this.prisma.routine.findFirst({
        where: {
          id: routineId,
        },
      });

      if (!routine)
        throw new HttpException('Rotina não encontrada', HttpStatus.NOT_FOUND);

      if (
        routine.userId !== user.id &&
        user.professionalId !== routine.professionalId
      )
        throw new HttpException(
          'Usuário não autorizado',
          HttpStatus.UNAUTHORIZED,
        );

      const activities = await this.prisma.activity.findMany({
        where: {
          routineId: routineId,
        },
        orderBy: {
          date: 'desc',
        },
      });

      return activities;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar atividades',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createActivityDto: Prisma.ActivityUncheckedCreateInput) {
    try {
      await this.prisma.activity.create({
        data: {
          date: new Date(createActivityDto.date),
          comments: createActivityDto.comments,
          effortLevel: createActivityDto.effortLevel,
          painLevel: createActivityDto.painLevel,
          routineId: createActivityDto.routineId,
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

  async remove(user: JwtPayload, activityId: string) {
    try {
      const activity = await this.prisma.activity.findFirst({
        where: {
          id: activityId,
        },
        include: {
          routine: true,
        },
      });

      if (!activity)
        throw new HttpException(
          'Atividade não encontrada',
          HttpStatus.NOT_FOUND,
        );

      if (
        activity.routine.userId !== user.id &&
        user.professionalId !== activity.routine.professionalId
      )
        throw new HttpException(
          'Usuário não autorizado',
          HttpStatus.UNAUTHORIZED,
        );

      await this.prisma.activity.delete({
        where: {
          id: activityId,
        },
      });

      return {
        message: 'Atividade removida com sucesso',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
