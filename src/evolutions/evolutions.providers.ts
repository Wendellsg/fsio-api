import { DataSource } from 'typeorm';
import { Evolution } from './entities/evolution.entity';

export const EvolutionsProviders = [
  {
    provide: 'EVOLUTIONS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Evolution),
    inject: ['DATA_SOURCE'],
  },
];
