import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
})
export class ProfessionalsModule {}
