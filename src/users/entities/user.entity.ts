import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export class Patient {
  userId: string;
  diagnosis: string;
  email?: string;
  name?: string;
  image?: string;
}

export class Routine {
  _id: string;
  professionalId: string;
  exerciseId: string;
  createdAt: Date;
  description: string;
  frequency: number;
  frequencyType: string;
  repetitions: number;
  series: number;
  period: string;
  activities?: Activity[];
}

export class Activity {
  id: string;
  routineId: string;
  createdAt: Date;
  pacientId: string;
  execerciseId: string;
  comentary: string;
  painLevel: number;
  effortLevel: number;
}

@Schema()
export class User {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  resetPasswordToken: string;

  @Prop({
    default: new Date(),
  })
  createdAt: Date;

  @Prop()
  image: string;

  @Prop()
  introduction: string;

  @Prop()
  phone: string;

  @Prop()
  profession: string;

  @Prop()
  professionalLicense: string;

  @Prop()
  professionalLicenseState: string;

  @Prop()
  professionalLicenseImage: string;

  @Prop()
  professionalVerifield: boolean;

  @Prop()
  professionalVerifieldAt: Date;

  @Prop()
  isProfessional: boolean;

  @Prop()
  isAdmin: boolean;

  @Prop()
  doctor: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  address: string;

  @Prop()
  addressNumber: string;

  @Prop()
  addressComplement: string;

  @Prop()
  addressNeighborhood: string;

  @Prop()
  addressCity: string;

  @Prop()
  addressState: string;

  @Prop()
  addressCountry: string;

  @Prop()
  zipCode: string;

  @Prop()
  birthDate: string;

  @Prop()
  patients: Patient[];

  @Prop()
  favoriteExercises: string[];

  @Prop()
  routines: Routine[];
}

export const UserSchema = SchemaFactory.createForClass(User);
