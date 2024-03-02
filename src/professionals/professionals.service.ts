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
}
