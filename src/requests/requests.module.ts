import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [PrismaModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
