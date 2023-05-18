import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema()
export class Exercise {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  image: string;

  @Prop()
  video: string;

  @Prop()
  summary: string;

  @Prop({
    default: new Date(),
  })
  createdAt: Date;

  @Prop({
    default: new Date(),
  })
  updatedAt: Date;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
