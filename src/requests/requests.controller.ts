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
import { RequestStatusEnum, UserRoleEnum } from '@prisma/client';
import { AuthGuard, Roles } from 'src/auth/auth.guard';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Post()
  create(@Request() request, @Body('patientId') patientId: string) {
    console.log('patientId', patientId);
    return this.requestsService.createRequest(
      patientId,
      request.user.professionalId,
    );
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Get('professional')
  findAllByProfessional(@Request() request) {
    return this.requestsService.findAllByProfessional(
      request.user.professionalId,
    );
  }

  @Roles(UserRoleEnum.patient)
  @UseGuards(AuthGuard)
  @Get('patient')
  findAllByPatient(@Request() request) {
    return this.requestsService.findAllByPatient(request.user.id);
  }

  @Roles(UserRoleEnum.patient)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() request,
    @Body('status') status: RequestStatusEnum,
  ) {
    if (status === RequestStatusEnum.accepted) {
      return this.requestsService.acceptRequest(id, request.user.id);
    }

    return this.requestsService.refuseRequest(id, request.user.id);
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() request) {
    return this.requestsService.remove(id, request.user.professionalId);
  }
}
