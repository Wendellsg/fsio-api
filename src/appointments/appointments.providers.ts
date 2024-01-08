import { DataSource } from 'typeorm';
import { Appointment, AppointmentComment } from './entities/appointment.entity';

export const AppointmentsProviders = [
  {
    provide: 'APPOINTMENTS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Appointment),
    inject: ['DATA_SOURCE'],
  },
];

export const AppointmentsCommentsProviders = [
  {
    provide: 'APPOINTMENTS_COMMENTS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AppointmentComment),
    inject: ['DATA_SOURCE'],
  },
];
