import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TEvolution = {
  _id: string;
  professionalId: string;
  patientId: string;
  date: Date;
  clinicalDiagnosis: string;
  physicalDiagnosis: string;
  evolution: string;
};

export type EvolutionDocument = HydratedDocument<Evolution>;

@Schema()
export class Evolution {
  _id: string;

  @Prop()
  patientId: string;

  @Prop()
  professionalId: string;

  @Prop()
  date: Date;

  @Prop()
  clinicalDiagnosis: string;

  @Prop()
  physicalDiagnosis: string;

  @Prop()
  evolution: string;

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

export const EvolutionSchema = SchemaFactory.createForClass(Evolution);
