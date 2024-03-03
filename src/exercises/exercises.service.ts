import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExerciseCategoryEnum, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(createExerciseDto: Prisma.ExerciseCreateInput) {
    try {
      const newExercise = this.prisma.exercise.create({
        data: createExerciseDto,
      });
      return {
        message: 'Exercício criado com sucesso',
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao criar exercício',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(search?: string, category?: ExerciseCategoryEnum) {
    const query: Prisma.ExerciseFindManyArgs = {};
    if (search) {
      query.where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }
    if (category) {
      query.where.category = category;
    }
    try {
      const exercises = await this.prisma.exercise.findMany(query);
      return exercises;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao buscar exercícios',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: string) {
    try {
      return this.prisma.exercise.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao buscar exercício',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateExerciseDto: Prisma.ExerciseUpdateInput) {
    try {
      await this.prisma.exercise.update({
        where: { id },
        data: updateExerciseDto,
      });
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao atualizar exercício',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.exercise.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao deletar exercício',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
