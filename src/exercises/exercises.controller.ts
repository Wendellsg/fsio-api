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
import { AdminAuthGuard, AuthGuard } from 'src/auth/auth.guard';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('search') search: string,
    @Query('category') category: string,
  ) {
    return this.exercisesService.findAll(search, category);
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.exercisesService.findOne(id));
      }, 1000); // 1000 milissegundos = 1 segundo
    });
  }
  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }
  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}
