import { Module } from '@nestjs/common';
import { HotelModule } from './Hotel/hotel.module';
import { BookingModule } from './Booking/booking.module';

@Module({
  imports: [HotelModule, BookingModule],
  controllers: [],
  providers: [],
})
export class ReservationManagementModule {}
