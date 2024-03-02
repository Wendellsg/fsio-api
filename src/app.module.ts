import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { DatabasesModule } from './databases/databases.module';
import { EvolutionsModule } from './evolutions/evolutions.module';
import { ExercisesModule } from './exercises/exercises.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { ActivitiesModule } from './activities/activities.module';
import { RequestsModule } from './requests/requests.module';
import { RotinesModule } from './rotines/rotines.module';
import { RoutinesModule } from './routines/routines.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
    ExercisesModule,
    UsersModule,
    UploadsModule,
    AppointmentsModule,
    EvolutionsModule,
    DatabasesModule,
    PatientsModule,
    ActivitiesModule,
    RequestsModule,
    RotinesModule,
    RoutinesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
