import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { createReviewDto } from '../dtos/createReview.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ReviewService } from '../services/review.service';
import { Roles } from 'src/auth/decoretors/role.decorator';
import { RolesGuard } from 'src/auth/guards/roleGuard.guard';

@Controller('api/v1/rating')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  //   create rating and comment
  @Post('/rating-by-id/:id/review')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  createRatingAndReview(
    @Param('id') hotelId: string,
    @Request() req,
    @Body() createReview: createReviewDto,
  ) {
    const userId = req.user.payload.id;
    // id: hotel's id
    return this.reviewService.reviewAndRating(hotelId, userId, createReview);
  }

  //   PATCH: update rating and comment

  @Patch('/rating-by-id/:id/update')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  updateReviewAndRating(
    @Param('id') id: string,
    @Body() updateReview: createReviewDto,
  ) {
    // id: id of review
    return this.reviewService.updateReviewAndRating(id, updateReview);
  }

  @Delete('/rating-by-id/:id/delete')
  @Roles('user', 'business')
  @UseGuards(AuthGuard, RolesGuard)
  deleteReview(@Param('id') id: string) {
    // id: id of review
    return this.reviewService.deleteReview(id);
  }

  @Get('/get-reviews-by-hotel-id/:id')
  @Roles('business')
  @UseGuards(AuthGuard, RolesGuard)
  getReviewsByHotel(@Param('id') id: string) {
    return this.reviewService.getReviewsByHotel(id);
  }

  @Get('/get-reviews-hotel/:hotelId/by-star/:star')
  @Roles('admin', 'business')
  @UseGuards(AuthGuard, RolesGuard)
  getReviewsByStar(
    @Param('hotelId') hotelId: string,
    @Param('star') star: number,
  ) {
    return this.reviewService.getReviewsByStar(hotelId, star);
  }
}
