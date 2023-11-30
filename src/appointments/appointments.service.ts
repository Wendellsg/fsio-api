import { Injectable } from '@nestjs/common';
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
    console.log(createAppointmentDto);
    const appointment = await this.appointmentModel.create(
      createAppointmentDto,
    );
    return appointment;
  }

  findAll() {
    return `This action returns all appointments`;
  }

  async findByDoctor(doctorId: string) {
    return await this.appointmentModel.find({ professionalId: doctorId });
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
