import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise, ExerciseDocument } from './entities/exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

  findOne(id: string) {
    try {
      return this.exerciseModel.findById(id);
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
      await this.exerciseModel.findByIdAndUpdate(id, updateExerciseDto);
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
      //Remove all user routines thas have this exercise

      await this.userModel.updateMany(
        {},
        { $pull: { routines: { exerciseId: id } } },
      );

      await this.exerciseModel.findByIdAndDelete(id);
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
