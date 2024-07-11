import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: Prisma.ProfessionalCreateInput) {
    const professional = await this.prisma.professional.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return professional;
  }

  async update(userId: string, data: Prisma.ProfessionalUpdateInput) {
    const professional = await this.prisma.professional.update({
      where: {
        userId: userId,
      },
      data,
    });

    return professional;
  }

  async findAll(id: string) {
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

  async me(id: string, userId: string) {
    const professional = await this.prisma.professional.findFirst({
      where: {
        userId,
      },
    });

    if (!professional)
      throw new HttpException(
        'Profissional não encontrado',
        HttpStatus.NOT_FOUND,
      );

    return professional;
  }
}
