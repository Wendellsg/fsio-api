import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/databases/databases.module';
import { UsersProviders } from 'src/users/users.providers';
import { AppointmentsController } from './appointments.controller';
import {
  AppointmentsCommentsProviders,
  AppointmentsProviders,
} from './appointments.providers';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [DatabasesModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    ...AppointmentsProviders,
    ...AppointmentsCommentsProviders,
    ...UsersProviders,
  ],
})
export class AppointmentsModule {}
