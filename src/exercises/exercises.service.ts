import { Injectable } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise, ExerciseDocument } from './entities/exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
  ) {}
  create(createExerciseDto: CreateExerciseDto) {
    return 'This action adds a new exercise';
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
