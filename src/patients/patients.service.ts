import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRoleEnum } from '@prisma/client';
import type { JwtPayload } from 'src/auth/auth.service';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/prisma/prisma.service';
import type { GetPatientResponseDTO, UpdatePatientDto } from './dtos';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}
  async findOne(patientId: string, professionalId: string) {
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
        phone: true,
        height: true,
        birthDate: true,
        address: true,
        professionals: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!patient)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const isProfessionalOfPatient = !!patient.professionals.find(
      (professional) => professional.id === professionalId,
    );

    if (!isProfessionalOfPatient)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    return patient;
  }

  async create(
    professionalId: string,
    newPatient: { name: string; email: string, birthDate: Date },
  ) {
    if (!professionalId)
      throw new HttpException(
        'Profissional não encontrado',
        HttpStatus.NOT_FOUND,
      );

    try {
      const userExists = await this.prisma.user.findFirst({
        where: {
          email: newPatient.email,
        },
      });

      if (userExists)
        throw new HttpException(
          'Usuário já cadastrado',
          HttpStatus.BAD_REQUEST,
        );

      const patient = await this.prisma.user.create({
        data: {
          ...newPatient,
          roles: [UserRoleEnum.patient],
        },
      });

      await this.prisma.professional.update({
        where: {
          id: professionalId,
        },
        data: {
          patients: {
            connect: {
              id: patient.id,
            },
          },
        },
      });

      //TODO - Enviar email de boas vindas

      return {
        message: 'Paciente criado com sucesso',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao criar paciente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async add(professionalId: string, patientId: string) {
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

  async findAll(professionalId: string): Promise<GetPatientResponseDTO> {
    const patients = await this.prisma?.user.findMany({
      where: {
        professionals: {
          some: {
            id: professionalId,
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

  async update(
    patientId: string,
    professionalId: string,
    updatePatientDto: UpdatePatientDto,
  ) {
    try {
      const patient = await this.prisma.user.findFirst({
        where: {
          id: patientId,
        },

        select: {
          professionals: true,
        },
      });

      if (!patient)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

      if (
        !patient.professionals.find(
          (professional) => professional.id === professionalId,
        )
      )
        throw new HttpException(
          'Você não pode atualizar este usuário',
          HttpStatus.FORBIDDEN,
        );

      await this.prisma.user.update({
        where: {
          id: patientId,
        },
        data: {
          name: updatePatientDto.name,
          height: updatePatientDto.height,
          weight: updatePatientDto.weight,
          phone: updatePatientDto.phone,
          birthDate: updatePatientDto.birthDate,
        },
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

  async remove(id: string, professionalId: string) {
    try {
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          professionals: {
            disconnect: {
              id: professionalId,
            },
          },
        },
      });

      return {
        message: 'Paciente removido com sucesso',
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao remover paciente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRoutines(patientId: string, user: JwtPayload) {
    const routines = await this.prisma.routine.findMany({
      where: {
        userId: patientId,
      },
      include: {
        exercise: true,
        professional: {
          select: {
            id: true,
          },
        },
      },
    });

    return routines;
  }
}
