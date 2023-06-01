import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { UsersModule } from './users/users.module';
import { UploadsModule } from './uploads/uploads.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
