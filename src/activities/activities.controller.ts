import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Prisma, UserRoleEnum } from '@prisma/client';
import { AuthGuard, Roles } from 'src/auth/auth.guard';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Roles(UserRoleEnum.professional, UserRoleEnum.patient)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createActivityDto: Prisma.ActivityUncheckedCreateInput) {
    return this.activitiesService.create(createActivityDto);
  }

  @Roles(UserRoleEnum.patient)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() request, @Param('id') id: string) {
    return this.activitiesService.remove(request.user.id, id);
  }
}
