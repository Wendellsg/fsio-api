import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise, ExerciseDocument } from './entities/exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
  ) {}
  async create(createExerciseDto: CreateExerciseDto) {
    try {
      const exercise = new this.exerciseModel(createExerciseDto);
      await exercise.save();
      return exercise;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao criar exercício',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(search?: string, category?: string) {
    const exercises = await this.exerciseModel.find({
      name: { $regex: search || '', $options: 'i' },
      category: { $regex: category || '', $options: 'i' },
    });
    return exercises;
  }

  findOne(id: number) {
    return `This action returns a #${id} exercise`;
  }

  update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return `This action updates a #${id} exercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} exercise`;
  }
}
