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
import { AuthGuard } from 'src/auth/auth.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() request,
  ) {
    createAppointmentDto.professionalId = request.user.id;
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('doctor')
  findByDoctor(@Request() request) {
    const doctorId = request.user.id;
    return this.appointmentsService.findByProfessional(doctorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() request,
  ) {
    return this.appointmentsService.update(
      id,
      updateAppointmentDto,
      request.user,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request) {
    return this.appointmentsService.remove(id, request.user);
  }
}
