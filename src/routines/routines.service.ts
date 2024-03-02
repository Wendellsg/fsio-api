import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Prisma,
  Routine,
  RoutineFrequencyTypeEnum,
  RoutinePeriodEnum,
} from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoutinesService {
  constructor(private prisma: PrismaService) {}

  async createRoutine(id: string, routine: Routine, professionalId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });
      if (!user)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      const professional = await this.prisma.professional.findFirst({
        where: {
          id: professionalId,
        },
      });

      if (!professional)
        throw new HttpException(
          'Profissional não encontrado',
          HttpStatus.NOT_FOUND,
        );

      const exercise = await this.prisma.exercise.findFirst({
        where: {
          id: routine.exerciseId,
        },
      });

      if (!exercise)
        throw new HttpException(
          'Exercício não encontrado',
          HttpStatus.NOT_FOUND,
        );
      await this.prisma.routine.create({
        data: {
          professionalId: professionalId,
          userId: id,
          exerciseId: routine.exerciseId,
          description: routine.description,
          frequency: routine.frequency,
          frequencyType: RoutineFrequencyTypeEnum[routine.frequencyType],
          period: RoutinePeriodEnum[routine.period],
          repetitions: routine.repetitions,
          series: routine.series,
        },
      });

      return {
        message: 'User updated',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao criar rotina',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRoutines(userId: string) {
    try {
      const routines = await this.prisma.routine.findMany({
        where: {
          user: {
            id: userId,
          },
        },
        select: {
          id: true,
          description: true,
          frequency: true,
          frequencyType: true,
          period: true,
          repetitions: true,
          series: true,
          exercise: {
            select: {
              id: true,
              name: true,
              description: true,
              summary: true,
              image: true,
              video: true,
            },
          },
          professional: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
            },
          },
          activities: {
            select: {
              id: true,
              date: true,
              comments: true,
              effortLevel: true,
              painLevel: true,
              createdAt: true,
            },
          },
        },
      });

      return routines;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao buscar rotinas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRoutine(
    id: string,
    routineId: string,
    routine: Prisma.RoutineUpdateInput,
  ) {
    try {
      const updatedUser = await this.prisma.routine.update({
        where: {
          id: routineId,
        },
        data: {
          ...routine,
        },
      });

      return {
        message: 'User updated',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar rotina',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
