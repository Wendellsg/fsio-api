import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: Prisma.AppointmentUncheckedCreateInput) {
    //Resolve time zone issue

    const startDate = new Date(createAppointmentDto.startDate);

    startDate.setHours(startDate.getHours() - 3);

    createAppointmentDto.startDate = startDate;

    const endDate = new Date(createAppointmentDto.endDate);

    endDate.setHours(endDate.getHours() - 3);

    createAppointmentDto.endDate = endDate;

    try {
      await this.prisma?.appointment.create({
        data: {
          ...createAppointmentDto,
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
    updateAppointmentDto: Prisma.AppointmentUncheckedUpdateInput,
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

      //Resolve time zone issue

      const startDate = new Date(updateAppointmentDto.startDate as string);

      startDate.setHours(startDate.getHours() - 3);

      updateAppointmentDto.startDate = startDate;

      const endDate = new Date(updateAppointmentDto.endDate as string);

      endDate.setHours(endDate.getHours() - 3);

      updateAppointmentDto.endDate = endDate;

      return await this.prisma?.appointment.update({
        where: { id },
        data: {
          startDate: updateAppointmentDto.startDate,
          endDate: updateAppointmentDto.endDate,
          status: updateAppointmentDto.status,
        },
      });
    } catch (error) {
      console.log(error);

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
