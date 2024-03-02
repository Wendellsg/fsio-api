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
import { Prisma, UserRoleEnum } from '@prisma/client';
import { AuthGuard, Roles } from 'src/auth/auth.guard';
import { RoutinesService } from './routines.service';

@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createRoutineDto: Prisma.RoutineCreateInput,
    @Request() request,
  ) {
    return this.routinesService.create(
      request.user.professionalId,
      createRoutineDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  findByPatient(@Request() request) {
    return this.routinesService.findByPatient(request.user.id);
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoutineDto: Prisma.RoutineUpdateInput,
  ) {
    return this.routinesService.update(id, updateRoutineDto);
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request) {
    return this.routinesService.remove(id, request.user.professionalId);
  }
}
