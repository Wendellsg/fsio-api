import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/databases/databases.module';
import { EvolutionsController } from './evolutions.controller';
import { EvolutionsProviders } from './evolutions.providers';
import { EvolutionsService } from './evolutions.service';

@Module({
  imports: [DatabasesModule],
  controllers: [EvolutionsController],
  providers: [EvolutionsService, ...EvolutionsProviders],
})
export class EvolutionsModule {}
