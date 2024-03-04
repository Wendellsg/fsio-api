import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ActivitiesModule } from './activities/activities.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { EvolutionsModule } from './evolutions/evolutions.module';
import { ExercisesModule } from './exercises/exercises.module';
import { PatientsModule } from './patients/patients.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { RequestsModule } from './requests/requests.module';
import { RoutinesModule } from './routines/routines.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { LeadsModule } from './leads/leads.module';

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
    PatientsModule,
    ActivitiesModule,
    RoutinesModule,
    ProfessionalsModule,
    PrismaModule,
    AnalyticsModule,
    RequestsModule,
    MailModule,
    LeadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
