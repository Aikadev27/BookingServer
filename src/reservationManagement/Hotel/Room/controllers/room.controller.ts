import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { createRoomDto } from '../dtos/createRoom.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decoretors/role.decorator';
import { RolesGuard } from 'src/auth/guards/roleGuard.guard';

@Controller('api/v1/hotel/room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('/get-all-rooms')
  getAllRooms() {
    return this.roomService.getAllRooms();
  }

  @Get('/get-by-status/:bookingStatus')
  getRoomsByStatus(@Param('bookingStatus') bookingStatus: boolean) {
    return this.roomService.getRoomsByStatus(bookingStatus);
  }

  @Get('get-room-by-id/:id')
  getRoomById(@Param('id') id: string) {
    return this.roomService.getRoomById(id);
  }

  @Patch('/add-img-by-id/:roomId')
  @Roles('business')
  @UseGuards(AuthGuard, RolesGuard)
  addImage(@Param('roomId') roomId: string, @Body() { imageUrl }) {
    return this.roomService.addImage(roomId, imageUrl);
  }

  @Delete(':roomId/delete-img-by-index/:imgIndex')
  @Roles('business')
  @UseGuards(AuthGuard, RolesGuard)
  deleteImgByIndex(
    @Param('roomId') roomId: string,
    @Param('imgIndex') imgIndex: number,
  ) {
    return this.roomService.deleteImgByIndex(roomId, imgIndex);
  }

  @Post('/create-room-by-hotel-id/:hotelId')
  @Roles('business')
  @UseGuards(AuthGuard, RolesGuard)
  createNewRoom(
    @Param('hotelId') hotelId: string,
    @Body() createRoomForm: createRoomDto,
  ) {
    console.log(createRoomForm);

    return this.roomService.createNewRoom(hotelId, createRoomForm);
  }

  @Patch('update-room-by-id/:id')
  @Roles('business')
  @UseGuards(AuthGuard, RolesGuard)
  updateRoomById(@Param('id') id: string, @Body() updateData) {
    return this.roomService.updateRoomById(id, updateData);
  }
}
