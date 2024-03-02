import { AppointmentStatusEnum } from '@prisma/client';

export class CreateAppointmentDto {
  patientId: string;
  professionalId: string;
  startDate: string;
  endDate: string;
  status: AppointmentStatusEnum;
}
