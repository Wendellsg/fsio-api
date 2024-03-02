import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Prisma, UserRoleEnum } from '@prisma/client';
import { AuthGuard, Roles } from 'src/auth/auth.guard';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createAppointmentDto: Prisma.AppointmentCreateInput,
    @Request() request,
  ) {
    if (
      request.user.professionalId !==
      createAppointmentDto.professional.connect.id
    ) {
      throw new HttpException(
        'Você não tem permissão para criar um agendamento para outro profissional',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.appointmentsService.create(createAppointmentDto);
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Get('professional')
  findByProfessional(
    @Request() request,
    @Query('start-date') startDate: Date,
    @Query('end-date') endDate: Date,
  ) {
    return this.appointmentsService.findByProfessional(
      request.user.professionalId,
      {
        startDate,
        endDate,
      },
    );
  }

  @Roles(UserRoleEnum.patient)
  @UseGuards(AuthGuard)
  @Get('patient')
  findByPatient(
    @Request() request,
    @Query('start-date') startDate: Date,
    @Query('end-date') endDate: Date,
  ) {
    return this.appointmentsService.findByPatient(request.user.id, {
      startDate,
      endDate,
    });
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: Prisma.AppointmentUpdateInput,
    @Request() request,
  ) {
    return this.appointmentsService.update(
      id,
      request.user.professionalId,
      updateAppointmentDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request) {
    return this.appointmentsService.remove(id, request.user.professionalId);
  }
}
