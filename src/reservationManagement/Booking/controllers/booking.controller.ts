import {
  Controller,
  Get,
  Request,
  UseGuards,
  Post,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { createReserveDto } from '../dtos/createReserveDto.dto';

@Controller('api/v1/booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}
  // user xem lich su dat phong
  @Get('/get-booking-history')
  @UseGuards(AuthGuard)
  getBookingHistory(@Request() req) {
    const userId = req.user.payload.id;
    return this.bookingService.getBookingHistory(userId);
  }

  // xem lich su dat phong cua 1 user nao do
  @Get('/get-booking-history-id/:id')
  @UseGuards(AuthGuard)
  getBookingHistoryById(@Param('id') id: string) {
    return this.bookingService.getBookingHistory(id);
  }

  // user dat phong

  @Post('/reserve-room-id/:roomId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  reserveRoom(
    @Param('roomId') roomId: string,
    @Body() reserveForm: createReserveDto,
    @Request() req,
  ) {
    const userId = req.user.payload.id;
    return this.bookingService.reserveRoom(userId, reserveForm, roomId);
  }
}
