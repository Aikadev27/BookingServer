import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from '../schema/Location.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}
  async createLocation(location) {
    const createdLocation = new this.locationModel({
      city: location.city,
      district: location.district,
      street: location.street,
      subAddress: location.subAddress,
    });
    await createdLocation.save();
    return createdLocation;
  }
}
