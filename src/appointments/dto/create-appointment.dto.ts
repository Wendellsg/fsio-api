import { AppointmentComment } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  patientId: string;
  professionalId: string;
  startDate: string;
  endDate: string;
  status: string;
  comments?: AppointmentComment[];
}
