import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppointmentStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: {
    professionalId: string;
    patientId: string;
    startDate: Date;
    endDate: Date;
    status: AppointmentStatusEnum;
  }) {
    try {
      const professional = await this.prisma?.professional.findUnique({
        where: { id: createAppointmentDto.professionalId },
      });

      if (!professional) {
        throw new Error('Profissional não encontrado');
      }

      const patient = await this.prisma?.user.findUnique({
        where: { id: createAppointmentDto.patientId },
      });

      if (!patient) {
        return Response.json(
          {
            message: 'Paciente não encontrado',
          },
          {
            status: 404,
          },
        );
      }

      this.prisma?.appointment.create({
        data: {
          professionalId: createAppointmentDto.professionalId,
          patientId: createAppointmentDto.patientId,
          startDate: createAppointmentDto.startDate,
          endDate: createAppointmentDto.endDate,
          status: createAppointmentDto.status,
        },
      });
      return {
        message: 'Agendamento criado com sucesso',
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao criar agendamento',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all appointments`;
  }

  async findByProfessional(
    professionalId: string,
    {
      startDate,
      endDate,
    }: {
      startDate: Date;
      endDate: Date;
    },
  ) {
    try {
      const professional = await this.prisma?.professional.findUnique({
        where: { id: professionalId },
      });

      if (!professional) {
        return Response.json(
          {
            message: 'Profissional não encontrado',
          },
          {
            status: 404,
          },
        );
      }

      return await this.prisma?.appointment.findMany({
        where: {
          professionalId: professional.id,
          startDate: {
            gte: startDate,
          },
          endDate: {
            lte: endDate,
          },
        },
        include: {
          patient: {
            select: {
              name: true,
              image: true,
              id: true,
              email: true,
            },
          },
          professional: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      return Response.json(
        {
          message: 'Erro ao buscar agendamentos',
          error,
        },
        {
          status: 500,
        },
      );
    }
  }

  async findByPatient(
    patientId: string,
    {
      startDate,
      endDate,
    }: {
      startDate: Date;
      endDate: Date;
    },
  ) {
    try {
      return await this.prisma?.appointment.findMany({
        where: {
          patientId: patientId,
          startDate: {
            gte: startDate,
          },
          endDate: {
            lte: endDate,
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao buscar agendamentos',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} appointment`;
  }

  async update(
    id: string,
    updateAppointmentDto: {
      professionalId: string;
      patientId: string;
      startDate: Date;
      endDate: Date;
      status: AppointmentStatusEnum;
    },
  ) {
    try {
      const professional = await this.prisma?.professional.findUnique({
        where: { id: updateAppointmentDto.professionalId },
      });

      if (!professional) {
        throw new HttpException(
          {
            message: 'Profissional não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const appointment = await this.prisma?.appointment.findUnique({
        where: { id },
      });

      if (!appointment || appointment.professionalId !== professional.id) {
        throw new HttpException(
          {
            message: 'Agendamento não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.prisma?.appointment.update({
        where: { id },
        data: updateAppointmentDto,
      });
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao atualizar agendamento',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, professionalId: string) {
    try {
      const appointment = await this.prisma?.appointment.findUnique({
        where: { id },
      });

      if (!appointment || appointment.professionalId !== professionalId) {
        throw new HttpException(
          {
            message: 'Agendamento não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.prisma?.appointment.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao deletar agendamento',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
