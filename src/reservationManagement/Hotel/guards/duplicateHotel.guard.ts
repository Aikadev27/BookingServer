import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { HotelService } from '../services/hotel.service';

@Injectable()
export class DuplicateHotelGuard implements CanActivate {
  constructor(private hotelService: HotelService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const createHotel = request.body;
    const userId = request.user.payload.id;
    console.log({ payload: userId });

    const isDuplicateHotel = await this.hotelService.checkHotelDuplicate(
      createHotel.nameHotel,
      userId,
      createHotel.street,
    );

    if (isDuplicateHotel) {
      return false;
    }

    return true;
  }
}
