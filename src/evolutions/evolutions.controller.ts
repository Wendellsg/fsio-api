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
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';
import { EvolutionsService } from './evolutions.service';

@Controller('evolutions')
export class EvolutionsController {
  constructor(private readonly evolutionsService: EvolutionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createEvolutionDto: CreateEvolutionDto, @Request() request) {
    createEvolutionDto.professionalId = request.user.id;
    return this.evolutionsService.create(createEvolutionDto);
  }

  @Get()
  findAll() {
    return this.evolutionsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('doctor')
  findByDoctor(@Request() request) {
    const doctorId = request.user.id;
    return this.evolutionsService.findByProfessional(doctorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evolutionsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEvolutionDto: UpdateEvolutionDto,
    @Request() request,
  ) {
    return this.evolutionsService.update(id, updateEvolutionDto, request.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request) {
    return this.evolutionsService.remove(id, request.user);
  }
}
