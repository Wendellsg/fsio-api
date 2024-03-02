import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExerciseCategoryEnum, Prisma, UserRoleEnum } from '@prisma/client';
import { AuthGuard, Roles } from 'src/auth/auth.guard';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Roles(UserRoleEnum.admin)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createExerciseDto: Prisma.ExerciseCreateInput) {
    return this.exercisesService.create(createExerciseDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('search') search: string,
    @Query('category') category: ExerciseCategoryEnum,
  ) {
    return this.exercisesService.findAll(search, category);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Roles(UserRoleEnum.admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: Prisma.ExerciseUpdateInput,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Roles(UserRoleEnum.admin)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}
