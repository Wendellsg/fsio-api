import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Prisma,
  RoutineFrequencyTypeEnum,
  RoutinePeriodEnum,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoutinesService {
  constructor(private prisma: PrismaService) {}

  async create(
    professionalId: string,
    createRoutineDto: Prisma.RoutineCreateInput,
  ) {
    try {
      const professional = await this.prisma.professional.findUnique({
        where: {
          userId: professionalId,
        },
      });

      if (!professional) {
        throw new HttpException(
          'Profissional não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.routine.create({
        data: {
          user: createRoutineDto.user,
          exercise: createRoutineDto.exercise,
          description: createRoutineDto.description,
          frequency: createRoutineDto.frequency,
          frequencyType:
            RoutineFrequencyTypeEnum[createRoutineDto.frequencyType],
          period: RoutinePeriodEnum[createRoutineDto.period],
          repetitions: createRoutineDto.repetitions,
          series: createRoutineDto.series,
          professional: {
            connect: {
              id: professionalId,
            },
          },
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

  async findByPatient(userId: string) {
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

  async update(routineId: string, routine: Prisma.RoutineUpdateInput) {
    try {
      const updatedRoutine = await this.prisma.routine.update({
        where: {
          id: routineId,
        },
        data: {
          ...routine,
        },
      });

      return {
        message: 'Routine updated',
        routine: updatedRoutine,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar rotina',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(routineId: string, professionalId: string) {
    try {
      const routine = await this.prisma.routine.findUnique({
        where: {
          id: routineId,
        },
        select: {
          professionalId: true,
        },
      });

      if (routine.professionalId !== professionalId) {
        throw new HttpException(
          'Você não tem permissão para deletar essa rotina',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.prisma.routine.delete({
        where: {
          id: routineId,
        },
      });

      return {
        message: 'Routine deleted',
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao deletar rotina',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
