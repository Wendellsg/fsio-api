import { DataSource } from 'typeorm';
import { Exercise } from './entities/exercise.entity';

export const ExercisesProviders = [
  {
    provide: 'EXERCISES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Exercise),
    inject: ['DATA_SOURCE'],
  },
];
