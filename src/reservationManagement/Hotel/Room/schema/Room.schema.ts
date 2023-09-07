import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Hotel } from '../../schema/Hotel.schema';

@Schema({
  timestamps: true,
})
export class Room extends Document {
  @Prop()
  roomNumber: string;

  @Prop()
  roomType: string;

  @Prop()
  desc: string;

  @Prop({ default: [] })
  imageUrl: string[];

  @Prop()
  pricePerNight: number;

  @Prop()
  floor: number;

  @Prop({ default: false })
  bookingStatus: boolean;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Hotel' })
  hotelId: Hotel;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
