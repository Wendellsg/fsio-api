import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserRoleEnum } from '@prisma/client';
import { AuthGuard, Roles } from 'src/auth/auth.guard';
import { ProfessionalsService } from './professionals.service';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Roles(UserRoleEnum.patient)
  @UseGuards(AuthGuard)
  @Get('/by-patient')
  findAll(@Request() request) {
    return this.professionalsService.findAll(request.user.id);
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Get('/me')
  me(@Request() request) {
    return this.professionalsService.me(request.user.professionalId);
  }
}
