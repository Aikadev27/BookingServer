import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('api/v1/booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}
  @Get('/get-booking-history')
  @UseGuards(AuthGuard)
  getBookingHistory(@Request() req) {
    const userId = req.user.payload.id;
    return this.bookingService.getBookingHistory(userId);
  }
}
