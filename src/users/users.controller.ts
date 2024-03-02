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
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRoleEnum.admin)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
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

  @Roles(UserRoleEnum.admin)
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Patch()
  update(@Request() request, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.usersService.update(request.user.id, updateUserDto);
  }

  @Roles(UserRoleEnum.admin)
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateByAdmin(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
  @Roles(UserRoleEnum.admin)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
