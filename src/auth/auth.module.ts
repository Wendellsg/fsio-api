import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/databases/databases.module';
import { UsersModule } from 'src/users/users.module';
import { UsersProviders } from 'src/users/users.providers';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, DatabasesModule],
  controllers: [AuthController],
  providers: [AuthService, ...UsersProviders],
})
export class AuthModule {}
