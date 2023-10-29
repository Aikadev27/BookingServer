import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { HotelService } from '../services/hotel.service';
import { createHotelDto } from '../dtos/createHotel.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decoretors/role.decorator';
import { RolesGuard } from 'src/auth/guards/roleGuard.guard';

@Controller('api/v1/hotel')
export class HotelController {
  constructor(private hotelService: HotelService) {}

  // POST: create hotel
  @Post('/create-hotel')
  @Roles('admin', 'business')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  CreateHotel(@Body() createHotel: createHotelDto, @Request() req) {
    const userId = req.user.payload.id;
    return this.hotelService.CreateHotel(createHotel, userId);
  }
  // PATCH:update hotel info
  @Roles('admin', 'business')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('/update-by-id/:id')
  updateHotel(@Param('id') id: string, @Body() updateData: createHotelDto) {
    return this.hotelService.updateHotelById(id, updateData);
  }

  // GET: get hotel by Id
  @Get('/get-by-id/:id')
  GetHotelById(@Param('id') id: string) {
    return this.hotelService.GetHotelById(id);
  }

  // GET: get list hotel by owner
  @Roles('admin', 'business')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/get-hotels-by-owner')
  getHotelsByOwner(@Request() req) {
    const userId = req.user.payload.id;
    return this.hotelService.getHotelsByOwner(userId);
  }

  //GET: get list hotel by location(City) ; all role
  @Get('/get-by-city/:city')
  getHotelsByCity(@Param('city') city: string) {
    return this.hotelService.getHotelsByCity(city);
  }

  // GET: get all hotel

  @Get('get-all-hotels')
  getAllHotels() {
    return this.hotelService.getAllHotels();
  }

  // DELETE: delete 1 hotel by id
  @Delete('/delete-by-id/:id')
  @Roles('admin', 'business')
  @UseGuards(AuthGuard, RolesGuard)
  deleteHotelById(@Param('id') id: string) {
    return this.hotelService.deleteHotelById(id);
  }

  @Patch('/add-img-by-id/:hotelId')
  @Roles('business')
  @UseGuards(AuthGuard, RolesGuard)
  addImage(@Param('hotelId') hotelId: string, @Body() { imageUrl }) {
    return this.hotelService.addImage(hotelId, imageUrl);
  }

  @Delete(':hotelId/delete-img-by-index/:imgIndex')
  @Roles('business')
  @UseGuards(AuthGuard, RolesGuard)
  deleteImgByIndex(
    @Param('hotelId') hotelId: string,
    @Param('imgIndex') imgIndex: number,
  ) {
    return this.hotelService.deleteImgByIndex(hotelId, imgIndex);
  }

  @Get('/search/:nameHotel')
  searchHotelsByName(@Param('nameHotel') nameHotel: string) {
    console.log(nameHotel);

    return this.hotelService.searchHotelsByName(nameHotel);
  }
  @Get('/search/:rating')
  searchHotelsByRating(@Param('rating') rating: number) {
    return this.hotelService.searchHotelsByRating(rating);
  }
}
