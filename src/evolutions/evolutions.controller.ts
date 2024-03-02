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
import { EvolutionsService } from './evolutions.service';

@Controller('evolutions')
export class EvolutionsController {
  constructor(private readonly evolutionsService: EvolutionsService) {}

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createEvolutionDto: Prisma.EvolutionCreateInput,
    @Request() request,
  ) {
    if (
      request.user.professionalId !== createEvolutionDto.professional.connect.id
    ) {
      throw new HttpException(
        'Você não tem permissão para criar uma evolução para outro profissional',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.evolutionsService.create(createEvolutionDto);
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Get()
  findByPatient(@Request() request, @Query('patientId') patientId: string) {
    return this.evolutionsService.findByPatient(
      request.user.professionalId,
      patientId,
    );
  }

  @Roles(UserRoleEnum.professional)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEvolutionDto: Prisma.EvolutionUpdateInput,
    @Request() request,
  ) {
    return this.evolutionsService.update(
      id,
      updateEvolutionDto,
      request.user.professionalId,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request) {
    return this.evolutionsService.remove(id, request.user);
  }
}
