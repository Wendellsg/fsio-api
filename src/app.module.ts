import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';

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
    MongooseModule.forRoot(
      `mongodb+srv://${encodeURIComponent(
        process.env.MONGO_DB_USER,
      )}:${encodeURIComponent(process.env.MONGO_DB_PASSWORD)}${
        process.env.MONGO_DB_HOST
      }/${process.env.MONGO_DB_COLLECTION}?retryWrites=true&w=majority`,
    ),
    AuthModule,
    ExercisesModule,
    UsersModule,
    UploadsModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
