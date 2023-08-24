import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Location extends Document {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  street: string;

  @Prop({ default: '' })
  subAddress: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
