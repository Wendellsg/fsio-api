import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type TAppointment = {
  _id: string;
  createdAt: Date;
  patientId: string;
  professionalId: string;
  startDate: string;
  endDate: string;
  status: AppointmentStatus;
  comments: AppointmentComment[];
};

export type AppointmentComment = {
  _id: string;
  createdAt: Date;
  comment: string;
};

export enum AppointmentStatus {
  Scheduled = 'scheduled',
  Canceled = 'canceled',
  Done = 'done',
}

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {
  _id: string;

  @Prop()
  patient: User;

  @Prop()
  professional: User;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop()
  status: AppointmentStatus;

  @Prop()
  comments: AppointmentComment[];

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
