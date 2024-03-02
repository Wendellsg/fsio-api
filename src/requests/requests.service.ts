import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RequestStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async createRequest(patientId: string, professionalId: string) {
    if (!patientId) {
      throw new HttpException(
        'Id do paciente não enviado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const professional = await this.prisma?.professional.findUnique({
      where: {
        id: professionalId,
      },
    });

    if (!professional) {
      throw new HttpException(
        'Profissional não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const patient = await this.prisma?.user.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      throw new HttpException('Paciente não encontrado', HttpStatus.NOT_FOUND);
    }

    const existRequest = await this.prisma?.request.findFirst({
      where: {
        userId: patient.id,
        professionalId: professional.id,
      },
    });

    if (existRequest) {
      throw new HttpException('Requisição já existe', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma?.request.create({
        data: {
          userId: patient.id,
          professionalId: professional.id,
        },
      });

      return;
      {
      }
    } catch (error) {
      throw new HttpException(
        'Erro ao criar requisição',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfessionalRequests(professionalId: string) {
    const requests = await this.prisma?.request.findMany({
      where: {
        professionalId: professionalId,
        AND: {
          OR: [
            {
              status: RequestStatusEnum.pending,
            },
            {
              status: RequestStatusEnum.rejected,
            },
          ],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            id: true,
            image: true,
          },
        },
      },
    });

    return requests;
  }

  async acceptRequest(requestId: string, patientId: string) {
    if (!requestId) {
      throw new HttpException(
        'Corpo da requisição não enviado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma?.user.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const request = await this.prisma?.request.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      throw new HttpException(
        'Requisição não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.prisma?.request.update({
        where: {
          id: requestId,
        },
        data: {
          status: RequestStatusEnum.accepted,
        },
      });

      await this.prisma?.professional.update({
        where: {
          id: request.professionalId,
        },
        data: {
          patients: {
            connect: {
              id: request.userId,
            },
          },
        },
      });

      return {
        message: 'Requisição aceita com sucesso',
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao aceitar requisição',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refuseRequest(requestId: string, patientId: string) {
    if (!requestId) {
      throw new HttpException(
        'Id requisição não enviado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma?.user.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const request = await this.prisma?.request.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      throw new HttpException(
        'Requisição não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.prisma?.request.update({
        where: {
          id: requestId,
        },
        data: {
          status: RequestStatusEnum.rejected,
        },
      });

      return { message: 'Requisição recusada com sucesso' };
    } catch (error) {
      throw new HttpException(
        'Erro ao recusar requisição',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPatientRequests(patientId: string) {
    const requests = await this.prisma?.request.findMany({
      where: {
        userId: patientId,
      },
      include: {
        professional: true,
      },
    });

    return requests;
  }

  async cancelRequest(requestId: string, professionalId: string) {
    if (!requestId) {
      throw new HttpException(
        'Id requisição não enviado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const request = await this.prisma?.request.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      return Response.json({ message: 'Requisição não encontrada' });
    }

    if (request.professionalId !== professionalId) {
      throw new HttpException(
        'Profissional não autorizado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      await this.prisma?.request.delete({
        where: {
          id: requestId,
        },
      });

      return { message: 'Requisição cancelada com sucesso' };
    } catch (error) {
      throw new HttpException(
        'Erro ao cancelar requisição',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
