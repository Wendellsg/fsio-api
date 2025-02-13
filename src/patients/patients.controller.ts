import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRoleEnum } from '@prisma/client';
import { AuthGuard, RequestWithUser, Roles } from 'src/auth/auth.guard';
import { UpdatePatientDto } from './dtos';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body()
    patient: {
      name: string;
      email: string;
      birthDate: Date;
    },
    @Request() request,
  ) {
    return this.patientsService.create(request.user.professionalId, patient);
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() request) {
    return this.patientsService.findAll(request.user.professionalId);
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() request) {
    return this.patientsService.findOne(id, request.user.professionalId);
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() request,
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(
      id,
      request.user.professionalId,
      updatePatientDto,
    );
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request) {
    return this.patientsService.remove(id, request.user.professionalId);
  }

  //Routines

  @UseGuards(AuthGuard)
  @Get(':id/routines')
  findRoutines(@Param('id') id: string, @Request() request: RequestWithUser) {
    return this.patientsService.getRoutines(id, request.user);
  }
}
