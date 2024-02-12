import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/databases/databases.module';
import { ExercisesProviders } from 'src/exercises/exercises.providers';
import { UsersController } from './users.controller';
import {
  ActivitiesProviders,
  RoutinesProviders,
  UsersProviders,
} from './users.providers';
import { UsersService } from './users.service';

@Module({
  imports: [DatabasesModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ...UsersProviders,
    ...RoutinesProviders,
    ...ActivitiesProviders,
    ...ExercisesProviders,
  ],
  exports: [UsersService],
})
export class UsersModule {}
