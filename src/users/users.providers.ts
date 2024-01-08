import { DataSource } from 'typeorm';
import { Activity, Routine, User } from './entities/user.entity';

export const UsersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];

export const RoutinesProviders = [
  {
    provide: 'ROUTINES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Routine),
    inject: ['DATA_SOURCE'],
  },
];

export const ActivitiesProviders = [
  {
    provide: 'ACTIVITIES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Activity),
    inject: ['DATA_SOURCE'],
  },
];
