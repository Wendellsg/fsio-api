import 'dotenv/config';
import { DataSource } from 'typeorm';
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        database: process.env.POSTGRES_DATABASE,
      });

      return dataSource.initialize();
    },
  },
];
