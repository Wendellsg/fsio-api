import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { type Prisma, UserRoleEnum } from '@prisma/client';
import { AuthGuard, type RequestWithUser, Roles } from 'src/auth/auth.guard';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAllByRoutine(
    @Query('routineId') routineId: string,
    @Request() request: RequestWithUser,
  ) {
    return this.activitiesService.findAll(routineId, request.user);
  }

  @Roles(UserRoleEnum.professional, UserRoleEnum.patient)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createActivityDto: Prisma.ActivityUncheckedCreateInput) {
    return this.activitiesService.create(createActivityDto);
  }

  @Roles(UserRoleEnum.patient)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() request: RequestWithUser, @Param('id') id: string) {
    return this.activitiesService.remove(request.user, id);
  }
}
