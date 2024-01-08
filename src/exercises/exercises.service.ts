import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Category, Exercise } from './entities/exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @Inject('EXERCISE_REPOSITORY')
    private exercisesRepository: Repository<Exercise>,
  ) {}
  async create(createExerciseDto: CreateExerciseDto) {
    try {
      const newExercise = this.exercisesRepository.create({
        ...createExerciseDto,
      });
      return await this.exercisesRepository.save(newExercise);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao criar exercício',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(search?: string, category?: Category) {
    const query = this.exercisesRepository.createQueryBuilder('exercise');

    if (search) {
      query.where('exercise.name ILIKE :search', { search: `%${search}%` });
    }

    if (category) {
      query.andWhere('exercise.category = :category', { category });
    }

    const exercises = await query.getMany();

    return exercises;
  }

  findOne(id: string) {
    try {
      return this.exercisesRepository.findOne({
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

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    try {
      await this.exercisesRepository.update(id, updateExerciseDto);
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
      await this.exercisesRepository.delete(id);
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
