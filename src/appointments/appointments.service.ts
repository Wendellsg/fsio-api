import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const appointment = await this.appointmentModel.create(
        createAppointmentDto,
      );
      return appointment;
    } catch (error) {
      throw new HttpException('Erro ao criar agendamento', error.status || 500);
    }
  }

  findAll() {
    return `This action returns all appointments`;
  }

  async findByDoctor(doctorId: string) {
    try {
      return await this.appointmentModel.find({ professionalId: doctorId });
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar agendamentos',
        error.status || 404,
      );
    }
  }

  async findByPatient(patientId: string) {
    try {
      return await this.appointmentModel.find({ patientId: patientId });
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

      return await this.appointmentModel.findByIdAndUpdate(
        id,
        updateAppointmentDto,
        { new: true },
      );
    } catch (error) {}
  }

  async remove(id: string, user: any) {
    try {
      const appointment = await this.appointmentModel.findById(id);

      if (appointment.professionalId !== user.id) {
        throw new HttpException('Não autorizado', 401);
      }

      await this.appointmentModel.findByIdAndDelete(id);

      return {
        message: 'Agendamento removido com sucesso',
      };
    } catch (error) {}
  }
}
