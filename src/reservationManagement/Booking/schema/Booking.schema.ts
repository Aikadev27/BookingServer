import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/schemas/User.schema';
import { Room } from 'src/reservationManagement/Hotel/Room/schema/Room.schema';

@Schema({
  timestamps: true,
})
export class Booking extends Document {
  @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
  customerId: User;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Room' })
  room: Room;

  @Prop()
  checkInDate: Date;

  @Prop()
  checkOutDate: Date;
}
export const BookingSchema = SchemaFactory.createForClass(Booking);
