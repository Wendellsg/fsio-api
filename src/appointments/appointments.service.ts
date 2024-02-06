import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('APPOINTMENTS_REPOSITORY')
    private appointmentRepository: Repository<Appointment>,
    @Inject('USERS_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const professional = await this.userRepository.findOne({
        where: { id: createAppointmentDto.professionalId },
      });

      if (!professional) {
        throw new HttpException('Profissional não encontrado', 404);
      }

      const patient = await this.userRepository.findOne({
        where: { id: createAppointmentDto.patientId },
      });

      if (!patient) {
        throw new HttpException('Paciente não encontrado', 404);
      }

      const newAppointment = this.appointmentRepository.create({
        professional,
        patient,
        startDate: createAppointmentDto.startDate,
        endDate: createAppointmentDto.endDate,
        status: createAppointmentDto.status,
      });
      return await this.appointmentRepository.save(newAppointment);
    } catch (error) {
      throw new HttpException('Erro ao criar agendamento', error.status || 500);
    }
  }

  findAll() {
    return `This action returns all appointments`;
  }

  async findByProfessional(doctorId: string) {
    try {
      return await this.appointmentRepository.find({
        where: { professional: { id: In([doctorId]) } },
        select: {
          patient: {
            email: true,
            id: true,
            name: true,
            image: true,
          },
          comments: true,
          endDate: true,
          id: true,
          startDate: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        relations: ['patient'],
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
      return await this.appointmentRepository.find({
        where: { patient: { id: In([patientId]) } },
        select: {
          professional: {
            email: true,
            id: true,
            name: true,
            image: true,
          },
          comments: true,
          endDate: true,
          id: true,
          startDate: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        relations: ['professional'],
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar agendamentos',
        error.status || 404,
      );
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} appointment`;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    user: any,
  ) {
    try {
      if (updateAppointmentDto.professionalId !== user.id) {
        throw new HttpException('Não autorizado', 401);
      }

      return await this.appointmentRepository.update(id, updateAppointmentDto);
    } catch (error) {}
  }

  async remove(id: string, user: any) {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!appointment || appointment.professional.id !== user.id) {
        throw new HttpException('Não autorizado', 401);
      }

      await this.appointmentRepository.delete(id);

      return {
        message: 'Agendamento removido com sucesso',
      };
    } catch (error) {}
  }
}
