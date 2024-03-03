import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) {}

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

  async me(id: string) {
    const professional = await this.prisma.professional.findFirst({
      where: {
        id: id,
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

    if (!professional)
      throw new HttpException(
        'Profissional não encontrado',
        HttpStatus.NOT_FOUND,
      );

    return professional;
  }
}
