import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RequestStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async createRequest(patientId: string, professionalId: string) {
    if (!patientId || !professionalId) {
      throw new HttpException(
        'Corpos da requisição não enviado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existRequest = await this.prisma?.request.findFirst({
      where: {
        userId: patientId,
        professionalId: professionalId,
      },
    });

    if (existRequest) {
      throw new HttpException('Requisição já existe', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma?.request.create({
        data: {
          userId: patientId,
          professionalId: professionalId,
        },
      });

      return {
        message: 'Requisição criada com sucesso',
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Erro ao criar requisição',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllByProfessional(professionalId: string) {
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

  async findAllByPatient(patientId: string) {
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

  async remove(requestId: string, professionalId: string) {
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
      return new HttpException(
        'Requisição não encontrada',
        HttpStatus.NOT_FOUND,
      );
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
