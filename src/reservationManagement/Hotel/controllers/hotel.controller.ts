import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HotelService } from '../services/hotel.service';
import { createHotelDto } from '../dtos/createHotel.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('api/v1/hotel')
export class HotelController {
  constructor(private hotelService: HotelService) {}
  @Post('/create-hotel')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  CreateHotel(@Body() createHotel: createHotelDto, @Request() req) {
    const userId = req.user.payload.id;

    return this.hotelService.CreateHotel(createHotel, userId);
  }
}
