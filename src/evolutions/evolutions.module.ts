import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evolution, EvolutionSchema } from './entities/evolution.entity';
import { EvolutionsController } from './evolutions.controller';
import { EvolutionsService } from './evolutions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evolution.name, schema: EvolutionSchema },
    ]),
  ],
  controllers: [EvolutionsController],
  providers: [EvolutionsService],
})
export class EvolutionsModule {}
