import { Controller } from '@nestjs/common';
import { RoomService } from '../services/room.service';

@Controller('api/v1/hotel/room')
export class RoomController {
  constructor(private roomService: RoomService) {}
}
