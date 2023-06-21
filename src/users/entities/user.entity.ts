import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
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
  adressCountry: string;

  @Prop()
  zipCode: string;

  @Prop()
  birthDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
