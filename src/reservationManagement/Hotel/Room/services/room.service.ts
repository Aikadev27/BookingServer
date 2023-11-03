import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from '../schema/Room.schema';
import { Hotel } from '../../schema/Hotel.schema';
@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
  ) {}

  async getAllRooms(): Promise<Room[]> {
    try {
      const rooms = await this.roomModel.find();
      return rooms;
    } catch (error) {
      throw error;
    }
  }

  async getRoomsByStatus(bookingStatus) {
    try {
      const rooms = await this.roomModel.find({ bookingStatus });
      return rooms;
    } catch (error) {
      throw error;
    }
  }

  async getRoomById(id: string): Promise<Room> {
    try {
      const room = await this.roomModel
        .findById(id)
        .select('-createAt -updateAt');
      if (!room) {
        throw new NotFoundException(`room with ${id} not found`);
      }
      return room;
    } catch (error) {
      throw error;
    }
  }

  async addImage(roomId, imageUrl) {
    try {
      const room = await this.roomModel.findById(roomId);
      if (!room) {
        throw new NotFoundException();
      }
      room.imageUrl.push(imageUrl);
      await room.save();
      return { message: 'add image success' };
    } catch (error) {
      throw error;
    }
  }

  async deleteImgByIndex(roomId, imgIndex) {
    try {
      const room = await this.roomModel.findById(roomId);
      if (!room) {
        throw new NotFoundException();
      }
      if (imgIndex < 0 || imgIndex >= room.imageUrl.length) {
        throw new NotFoundException(`Image index ${imgIndex} not found.`);
      }
      room.imageUrl.splice(imgIndex, 1);
      await room.save();

      return { message: 'delete image success' };
    } catch (error) {
      throw error;
    }
  }

  async createNewRoom(hotelId, createRoomForm) {
    try {
      const hotel = await this.hotelModel.findById(hotelId);
      if (!hotel) {
        throw new NotFoundException();
      }
      const room = await this.roomModel.findOne({
        roomNumber: createRoomForm.roomNumber,
      });

      if (room) {
        throw new Error(`room ${createRoomForm.roomNumber} was exits`);
      }
      const newRoom = new this.roomModel({
        ...createRoomForm,
      });
      hotel.rooms.push(newRoom);
      await newRoom.save();
      await hotel.save();
      return { message: `create room ${createRoomForm.roomNumber} success` };
    } catch (error) {
      throw error;
    }
  }

  async updateRoomById(id, updateData) {
    try {
      const updatedRoom = await this.roomModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );
      if (!updatedRoom) {
        throw new NotFoundException('hotel not found');
      }
      return { message: 'update success', updateRoom: updatedRoom };
    } catch (error) {
      throw error;
    }
  }

  async deleteRoomById(roomId: string) {
    try {
      const room = await this.roomModel.findByIdAndDelete(roomId);
      if (!room) {
        throw new NotFoundException('not found this room ??');
      }
      return { message: 'Delete room success' };
    } catch (error) {
      throw error;
    }
  }
}
