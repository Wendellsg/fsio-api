import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard, AuthGuard } from 'src/auth/auth.guard';
import { CreateRoutineDto } from './dto/create-routine-dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AdminAuthGuard)
  @Post('patients')
  createPatient(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createByDoctor(createUserDto);
  }

  @UseGuards(AdminAuthGuard)
  @Get('patients/:id')
  getPatient(@Param('id') id: string) {
    return this.usersService.getPatient(id);
  }

  @UseGuards(AuthGuard)
  @Patch('patients')
  addPatient(@Request() request, @Body() body) {
    return this.usersService.addPatient(request.user.id, body.patientId);
  }
  @UseGuards(AuthGuard)
  @Patch('patients/:id')
  updatePatient(
    @Request() request,
    @Body()
    body: {
      patient: Partial<User>;
      diagnosis: string;
    },
  ) {
    return this.usersService.updatePatient(
      request.user.id,
      body.patient,
      body.diagnosis,
    );
  }

  @UseGuards(AuthGuard)
  @Get('patients')
  findPatients(@Request() request) {
    return this.usersService.findPatients(request.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('favorite-exercises')
  addFavoriteExercise(
    @Request() request,
    @Body('exerciseId') exerciseId: string,
  ) {
    return this.usersService.addFavoriteExercise(request.user.id, exerciseId);
  }

  @UseGuards(AuthGuard)
  @Delete('favorite-exercises/:exerciseId')
  removeFavoriteExercise(
    @Request() request,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.usersService.removeFavoriteExercise(
      request.user.id,
      exerciseId,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('image')
  updateProfileImage(@Request() request, @Body() body) {
    return this.usersService.updateProfileImage(
      request.user.id,
      body.profileImage,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/by-email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Delete('patient/:id')
  removePatient(@Request() request, @Param('id') id: string) {
    return this.usersService.removePatient(request.user.id, id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/routines')
  createRoutine(
    @Param('id') id: string,
    @Body() createRoutineDto: CreateRoutineDto,
    @Request() request,
  ) {
    return this.usersService.createRoutine(
      id,
      createRoutineDto,
      request.user.id,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id/routines/:routineId')
  updateRoutine(
    @Param('id') id: string,
    @Param('routineId') routineId: string,
    @Body() updateRoutineDto: CreateRoutineDto,
    @Request() request,
  ) {
    if (request.user.id !== updateRoutineDto.professionalId)
      throw new HttpException(
        'Você não tem permissão para atualizar esta rotina',
        400,
      );

    return this.usersService.updateRoutine(id, routineId, updateRoutineDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Patch()
  update(@Request() request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(request.user.id, updateUserDto);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  updateAdmin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
