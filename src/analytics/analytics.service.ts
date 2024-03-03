import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfessionalDashBoardDto } from './dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getProfessionalDashboardData(
    professionalId: string,
  ): Promise<ProfessionalDashBoardDto> {
    const patients = await this.prisma?.user.count({
      where: {
        professionals: {
          some: {
            id: professionalId,
          },
        },
      },
    });

    const appointments = await this.prisma?.appointment.count({
      where: {
        professionalId: professionalId,
      },
    });

    const routines = await this.prisma?.routine.count({
      where: {
        professionalId: professionalId,
      },
    });

    return {
      patients,
      appointments,
      routines,
    };
  }
}
