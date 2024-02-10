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
import { AuthGuard, Roles } from 'src/auth/auth.guard';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CreateRoutineDto } from './dto/create-routine-dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.ADMIN, Role.PROFESSIONAL)
  @UseGuards(AuthGuard)
  @Post('patients')
  createPatient(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createByDoctor(createUserDto);
  }

  @Roles(Role.PROFESSIONAL)
  @UseGuards(AuthGuard)
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
    return this.usersService.updatePatient(body.patient);
  }

  @UseGuards(AuthGuard)
  @Get('patients')
  findPatients(@Request() request) {
    return this.usersService.findPatients(request.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('professionals')
  findUserProfessionals(@Request() request) {
    return this.usersService.findUserProfessionals(request.user.id);
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

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
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
  @Delete('patients/:id')
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
  @Get('/routines')
  getRoutine(@Request() request) {
    console.log('getRoutine', request.id);
    return this.usersService.getRoutines(request.user.id);
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

  @UseGuards(AuthGuard)
  @Post('routines/:routineId/activity')
  createActivity(
    @Param('id') id: string,
    @Param('routineId') routineId: string,
    @Body() createActivityDto: CreateActivityDto,
    @Request() request,
  ) {
    return this.usersService.createActivity(
      request.user.id,
      routineId,
      createActivityDto,
    );
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

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateAdmin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
