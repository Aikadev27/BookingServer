import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Booking } from 'src/reservationManagement/Booking/schema/Booking.schema';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ unique: [true, 'duplicate email'] })
  email: string;

  @Prop({ required: true })
  password: string;

  // information of user
  @Prop()
  address: string;

  @Prop()
  sex: boolean;

  @Prop()
  age: number;

  @Prop({ required: [true, 'phone number cannot empty'], unique: true })
  phoneNumber: string;

  @Prop({ default: '' })
  avatarUrl: string;

  @Prop({ default: 'client' })
  role: string;

  @Prop({ default: undefined })
  isBusiness: boolean;

  // lich su dat phong
  @Prop([{ type: mongoose.Schema.ObjectId, ref: 'Booking' }])
  bookingHistory: Booking[];
}
export const UserSchema = SchemaFactory.createForClass(User);
