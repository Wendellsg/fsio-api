import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EvolutionsController } from './evolutions.controller';
import { EvolutionsService } from './evolutions.service';

@Module({
  imports: [PrismaModule],
  controllers: [EvolutionsController],
  providers: [EvolutionsService],
})
export class EvolutionsModule {}
