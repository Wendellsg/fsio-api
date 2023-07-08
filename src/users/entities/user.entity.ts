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
}

export const UserSchema = SchemaFactory.createForClass(User);
