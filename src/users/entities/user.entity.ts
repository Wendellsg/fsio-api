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
  role: 'patient' | 'doctor' | 'admin';

  @Prop()
  doctor: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
