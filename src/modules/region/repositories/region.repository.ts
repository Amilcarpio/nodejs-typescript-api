import { RegionModel } from '../models/region.model';
import {
  IRegion,
  FindByPointQuery,
  FindByDistanceQuery,
  FindByAddressQuery,
} from '../interfaces/region.interface';
import { CreateRegionDTO, UpdateRegionDTO } from '../dtos/region.dto';

/**
 * Repository for Region entity.
 * Handles all database operations for regions.
 */
export class RegionRepository {
  /**
   * Find regions that contain a specific point
   */
  async findByPoint(query: FindByPointQuery): Promise<IRegion[]> {
    const { longitude, latitude } = query;

    return RegionModel.find({
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
      },
    });
  }

  /**
   * Find regions within a certain distance of a point
   */
  async findByDistance(query: FindByDistanceQuery): Promise<IRegion[]> {
    const { longitude, latitude, distance, unit = 'meters' } = query;

    let distanceInMeters = distance;
    if (unit === 'kilometers') {
      distanceInMeters = distance * 1000;
    } else if (unit === 'miles') {
      distanceInMeters = distance * 1609.34;
    }

    return RegionModel.find({
      geometry: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: distanceInMeters,
        },
      },
    });
  }

  async findByAddress(query: FindByAddressQuery): Promise<IRegion[]> {
    return RegionModel.find({
      address: query.address,
      countryCode: query.countryCode,
    });
  }

  async getAll(): Promise<IRegion[]> {
    return RegionModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IRegion | null> {
    return RegionModel.findById(id);
  }

  async create(data: CreateRegionDTO): Promise<IRegion> {
    return RegionModel.create(data);
  }

  async update(id: string, data: UpdateRegionDTO): Promise<IRegion | null> {
    return RegionModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await RegionModel.findByIdAndDelete(id);
    return !!result;
  }
}

export const regionRepository = new RegionRepository();
