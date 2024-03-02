import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserRoleEnum } from '@prisma/client';
import { AuthGuard, Roles } from 'src/auth/auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Get('professional-dashboard')
  getProfessionalDashboardData(@Request() req) {
    return this.analyticsService.getProfessionalDashboardData(
      req.user.professionalId,
    );
  }
}
