import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: Prisma.AppointmentCreateInput) {
    try {
      await this.prisma?.appointment.create({
        data: {
          professional: {
            connect: { id: createAppointmentDto.professional.connect.id },
          },
          patient: {
            connect: { id: createAppointmentDto.patient.connect.id },
          },
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
        throw new HttpException(
          {
            message: 'Profissional não encontrado',
          },
          HttpStatus.NOT_FOUND,
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
      throw new HttpException(
        {
          message: 'Erro ao buscar agendamentos',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
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

  async update(
    id: string,
    professionalId: string,
    updateAppointmentDto: Prisma.AppointmentUpdateInput,
  ) {
    try {
      const appointment = await this.prisma?.appointment.findUnique({
        where: { id },
      });

      if (!appointment || appointment.professionalId !== professionalId) {
        throw new HttpException(
          {
            message: 'Você não tem permissão para atualizar este agendamento',
          },
          HttpStatus.FORBIDDEN,
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
