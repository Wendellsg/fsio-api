import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';
import { Evolution } from './entities/evolution.entity';

@Injectable()
export class EvolutionsService {
  constructor(
    @InjectModel(Evolution.name)
    private readonly evolutionModel: Model<Evolution>,
  ) {}

  async create(createEvolutionDto: CreateEvolutionDto) {
    try {
      const evolution = await this.evolutionModel.create(createEvolutionDto);
      return evolution;
    } catch (error) {
      throw new HttpException('Erro ao criar agendamento', error.status || 500);
    }
  }

  findAll() {
    return `This action returns all evolutions`;
  }

  async findByDoctor(doctorId: string) {
    try {
      return await this.evolutionModel.find({ professionalId: doctorId });
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar agendamentos',
        error.status || 404,
      );
    }
  }

  async findByPatient(patientId: string) {
    try {
      return await this.evolutionModel.find({ patientId: patientId });
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar agendamentos',
        error.status || 404,
      );
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} evolution`;
  }

  async update(id: string, updateEvolutionDto: UpdateEvolutionDto, user: any) {
    try {
      if (updateEvolutionDto.professionalId !== user.id) {
        throw new HttpException('Não autorizado', 401);
      }

      return await this.evolutionModel.findByIdAndUpdate(
        id,
        updateEvolutionDto,
        { new: true },
      );
    } catch (error) {}
  }

  async remove(id: string, user: any) {
    try {
      const evolution = await this.evolutionModel.findById(id);

      if (evolution.professionalId !== user.id) {
        throw new HttpException('Não autorizado', 401);
      }

      await this.evolutionModel.findByIdAndDelete(id);

      return {
        message: 'Agendamento removido com sucesso',
      };
    } catch (error) {}
  }
}
