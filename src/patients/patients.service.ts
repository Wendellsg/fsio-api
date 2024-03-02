import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findPatients(id: string) {
    const user = await this.prisma.professional.findFirst({
      where: {
        id: id,
      },
      include: {
        patients: true,
      },
    });

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    return user.patients.map((patient) => {
      return patient;
    });
  }

  async findUserProfessionals(id: string) {
    const professionals = await this.prisma.professional.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!professionals)
      throw new HttpException(
        'Profissionais não encontrados',
        HttpStatus.NOT_FOUND,
      );

    return professionals;
  }

  async getPatient(patientId: string) {
    const patient = await this.prisma.user.findFirst({
      where: {
        id: patientId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        weight: true,
        height: true,
        routines: {
          select: {
            professional: {
              select: {
                id: true,
              },
            },
            activities: true,
            exercise: {
              select: {
                id: true,
                name: true,
                description: true,
                image: true,
              },
            },
            id: true,
            description: true,
            frequency: true,
            frequencyType: true,
            period: true,
            repetitions: true,
            series: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!patient)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    return {
      message: 'Usuário encontrado',
      data: patient,
    };
  }

  async addPatient(professionalId: string, patientId: string) {
    const professional = await this.prisma.professional.findFirst({
      where: {
        id: professionalId,
      },

      include: {
        patients: true,
      },
    });

    if (!professional)
      throw new HttpException(
        'Profissional não encontrado',
        HttpStatus.NOT_FOUND,
      );

    if (professional.patients.find((patient) => patient.id === patientId))
      throw new HttpException('Paciente já adicionado', HttpStatus.BAD_REQUEST);

    const patient = await this.prisma.user.findFirst({
      where: {
        id: patientId,
      },
      select: {
        professionals: true,
      },
    });

    if (!patient)
      throw new HttpException('Paciente não encontrado', HttpStatus.NOT_FOUND);

    await this.prisma.professional.update({
      where: {
        id: professionalId,
      },
      data: {
        patients: {
          connect: {
            id: patientId,
          },
        },
      },
    });

    return {
      message: 'User updated',
    };
  }

  async getPatients(userId: string) {
    const professional = await this.prisma?.professional.findUnique({
      where: {
        id: userId,
      },
    });

    const patients = await this.prisma?.user.findMany({
      where: {
        professionals: {
          some: {
            id: professional?.id,
          },
        },
      },

      select: {
        id: true,
        name: true,
        image: true,
        email: true,
      },
    });

    return patients;
  }

  async removePatient(id: string, patientId: string) {
    try {
      // Carregar o usuário com seus pacientes
      const user = await this.prisma.professional.findFirst({
        where: {
          id: id,
        },
        include: {
          patients: true,
        },
      });

      if (!user)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

      // Encontrar o paciente que precisa ser removido
      const patientToRemove = user.patients.find(
        (patient) => patient.id === patientId,
      );

      if (!patientToRemove)
        throw new HttpException(
          'Paciente não encontrado',
          HttpStatus.NOT_FOUND,
        );
      // Remover o paciente da lista de pacientes do profissional
      await this.prisma.professional.update({
        where: {
          id: id,
        },
        data: {
          patients: {
            disconnect: {
              id: patientId,
            },
          },
        },
      });

      return {
        message: 'User updated',
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao remover paciente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addPatientToProfessional(professionalId: string, patientId: string) {
    const professional = await this.prisma.professional.findFirst({
      where: {
        id: professionalId,
      },
      include: {
        patients: true,
      },
    });

    if (!professional)
      throw new HttpException(
        'Profissional não encontrado',
        HttpStatus.NOT_FOUND,
      );

    if (professional.patients.find((patient) => patient.id === patientId))
      throw new HttpException('Paciente já adicionado', HttpStatus.BAD_REQUEST);

    const patient = await this.prisma.user.findFirst({
      where: {
        id: patientId,
      },
      select: {
        professionals: true,
      },
    });

    if (!patient)
      throw new HttpException('Paciente não encontrado', HttpStatus.NOT_FOUND);

    const updatedUser = await this.prisma.professional.update({
      where: {
        id: professionalId,
      },
      data: {
        patients: {
          connect: {
            id: patientId,
          },
        },
      },
    });

    return {
      message: 'User updated',
      data: updatedUser,
    };
  }

  async updatePatient(patient: Partial<User>) {
    try {
      await this.prisma.user.update({
        where: {
          id: patient.id,
        },
        data: { ...patient },
      });

      return {
        message: 'User updated',
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
