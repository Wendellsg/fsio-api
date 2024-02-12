import { HttpException, Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';
import { Evolution } from './entities/evolution.entity';

@Injectable()
export class EvolutionsService {
  constructor(
    @Inject('EVOLUTIONS_REPOSITORY')
    private evolutionsRepository: Repository<Evolution>,
  ) {}

  async create(createEvolutionDto: CreateEvolutionDto) {
    try {
      const newEvolution = this.evolutionsRepository.create(createEvolutionDto);

      return await this.evolutionsRepository.save(newEvolution);
    } catch (error) {
      throw new HttpException('Erro ao criar agendamento', error.status || 500);
    }
  }

  findAll() {
    return `This action returns all evolutions`;
  }

  async findByProfessional(professionalId: string) {
    try {
      return await this.evolutionsRepository.find({
        where: {
          professional: { id: In([professionalId]) },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar agendamentos',
        error.status || 404,
      );
    }
  }

  async findByPatient(patientId: string) {
    try {
      return await this.evolutionsRepository.find({
        where: {
          user: { id: In([patientId]) },
        },
      });
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

      return await this.evolutionsRepository.update(id, updateEvolutionDto);
    } catch (error) {}
  }

  async remove(id: string, user: any) {
    try {
      const evolution = await this.evolutionsRepository.findOne({
        where: {
          id: In([id]),
        },
      });

      if (!evolution || evolution.professional.id !== user.id) {
        throw new HttpException('Não autorizado', 401);
      }

      await this.evolutionsRepository.delete(id);

      return {
        message: 'Agendamento removido com sucesso',
      };
    } catch (error) {}
  }
}
