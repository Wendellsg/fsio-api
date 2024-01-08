import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/databases/databases.module';
import { ExercisesController } from './exercises.controller';
import { ExercisesProviders } from './exercises.providers';
import { ExercisesService } from './exercises.service';

@Module({
  imports: [DatabasesModule],
  controllers: [ExercisesController],
  providers: [ExercisesService, ...ExercisesProviders],
})
export class ExercisesModule {}
