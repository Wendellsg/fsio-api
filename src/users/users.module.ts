import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/databases/databases.module';
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
  ],
  exports: [UsersService],
})
export class UsersModule {}
