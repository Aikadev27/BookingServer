import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from '../schema/Review.schema';
import { Model } from 'mongoose';
import { Hotel } from '../schema/Hotel.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
  ) {}
  async reviewAndRating(hotelId: string, userId, createReview) {
    try {
      const hotel = await this.hotelModel.findById(hotelId);
      if (!hotel) {
        throw new NotFoundException('cannot find hotel');
      }

      const review = new this.reviewModel({
        ...createReview,
        userId,
        hotelId,
      });
      hotel.reviews.push(review);
      hotel.rateCount = hotel.rateCount + 1;
      hotel.totalRating = hotel.totalRating + createReview.rating;
      hotel.averageRating = this.calculateAverageRating(
        hotel.totalRating,
        hotel.rateCount,
      );
      await review.save();
      await hotel.save();
      return hotel;
    } catch (error) {
      throw error;
    }
  }
  private calculateAverageRating(totalRating: number, rateCount: number) {
    return parseFloat((totalRating / rateCount).toFixed(1));
  }

  async updateReviewAndRating(id: string, updateReview): Promise<Review> {
    try {
      const review = await this.reviewModel.findById(id);

      if (!review) {
        throw new NotFoundException(`review with id ${id} not found`);
      }

      const hotel = await this.hotelModel.findById(review.hotelId);

      if (updateReview.rating > review.rating) {
        hotel.totalRating =
          hotel.totalRating + (updateReview.rating - review.rating);
      } else {
        hotel.totalRating =
          hotel.totalRating - (review.rating - updateReview.rating);
      }

      hotel.averageRating = this.calculateAverageRating(
        hotel.totalRating,
        hotel.rateCount,
      );

      await hotel.save();

      review.rating = updateReview.rating;
      review.comment = updateReview.comment;
      await review.save(updateReview);
      return review;
    } catch (error) {
      throw error;
    }
  }

  async deleteReview(id: string) {
    try {
      const review = await this.reviewModel.findByIdAndDelete(id);

      if (!review) {
        throw NotFoundException;
      }
      const hotel = await this.hotelModel.findById(review.hotelId);

      const updatedReviews = hotel.reviews.filter(
        (hotelReview) => hotelReview._id.toString() !== id,
      );
      //   Re update info hotel
      hotel.reviews = updatedReviews;
      hotel.totalRating = hotel.totalRating - review.rating;
      hotel.rateCount = hotel.rateCount - 1;
      hotel.averageRating = this.calculateAverageRating(
        hotel.totalRating,
        hotel.rateCount,
      );
      await hotel.save();
      return { message: `review's id ${id} was deleted success` };
    } catch (error) {
      throw error;
    }
  }

  async getReviewsByHotel(id: string) {
    try {
      const hotel = await this.hotelModel
        .findById(id)
        .populate('reviews', '-hotelId  -__v');
      if (!hotel) {
        throw new NotFoundException(`hotel with id ${id} not found `);
      }
      const ListReviews = hotel.reviews;
      return ListReviews;
    } catch (error) {
      throw error;
    }
  }

  async getReviewsByStar(hotelId: string, star: number): Promise<Review[]> {
    try {
      const hotel = await this.hotelModel
        .findById(hotelId)
        .populate('reviews', '-hotelId -__v');

      if (!hotel) {
        throw new NotFoundException(`cannot find hotel with id ${hotelId}`);
      }
      const listReviews = hotel.reviews;

      const reviewsFiltered = listReviews.filter((item) => item.rating == star);

      return reviewsFiltered;
    } catch (error) {
      throw error;
    }
  }
}
