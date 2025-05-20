import { RegionRepository } from '../repositories/region.repository';
import {
  IRegion,
  FindByPointQuery,
  FindByDistanceQuery,
  FindByAddressQuery,
} from '../interfaces/region.interface';
import { CreateRegionDTO, UpdateRegionDTO } from '../dtos/region.dto';
import { ApplicationError } from '../../../common/errors/application-error';
import {
  geocodingService,
  GeocodeResult,
} from '../../../common/services/geocoding.service';

export class RegionService {
  constructor(private readonly repository: RegionRepository) {}

  async getAll(): Promise<IRegion[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<IRegion> {
    const entity = await this.repository.findById(id);
    if (!entity)
      throw new ApplicationError('region.not_found', 404, 'region.not_found');
    return entity;
  }

  async create(regionData: CreateRegionDTO): Promise<IRegion> {
    this.validatePolygon(regionData.geometry.coordinates);
    return this.repository.create(regionData);
  }

  async update(id: string, updateData: UpdateRegionDTO): Promise<IRegion> {
    if (updateData.geometry)
      this.validatePolygon(updateData.geometry.coordinates);
    const entity = await this.repository.update(id, updateData);
    if (!entity) {
      throw new ApplicationError('region.not_found', 404, 'region.not_found');
    }
    return entity;
  }

  async delete(id: string): Promise<void> {
    const success = await this.repository.delete(id);
    if (!success)
      throw new ApplicationError('region.not_found', 404, 'region.not_found');
  }

  async findRegionsByPoint(
    query: FindByPointQuery | { address: string; countryCode?: string }
  ): Promise<IRegion[]> {
    if ('address' in query) {
      const geo = await geocodingService.geocodeAddress(
        query.address,
        query.countryCode
      );
      if (!geo) return [];
      return this.repository.findByPoint({
        longitude: geo.longitude,
        latitude: geo.latitude,
      });
    }
    return this.repository.findByPoint(query);
  }

  async findRegionsByDistance(
    query:
      | FindByDistanceQuery
      | {
          address: string;
          distance: number;
          countryCode?: string;
          unit?: 'meters' | 'kilometers' | 'miles';
        }
  ): Promise<IRegion[]> {
    if ('address' in query) {
      const geo = await geocodingService.geocodeAddress(
        query.address,
        query.countryCode
      );
      if (!geo) return [];
      return this.repository.findByDistance({
        longitude: geo.longitude,
        latitude: geo.latitude,
        distance: query.distance,
        unit: query.unit,
      });
    }
    return this.repository.findByDistance(query);
  }

  async findRegionsByAddress(
    query: FindByAddressQuery
  ): Promise<GeocodeResult[]> {
    const results = await geocodingService.geocodeAddressMultiple(
      query.address,
      query.countryCode
    );
    return results || [];
  }

  private validatePolygon(coordinates: number[][][]): void {
    if (!coordinates || !coordinates.length || !coordinates[0]) {
      throw new ApplicationError(
        'region.invalid_polygon',
        400,
        'region.invalid_polygon'
      );
    }
    const firstRing = coordinates[0];
    if (firstRing.length < 4) {
      throw new ApplicationError(
        'region.too_few_coordinates',
        400,
        'region.too_few_coordinates'
      );
    }
    const firstPoint = firstRing[0];
    const lastPoint = firstRing[firstRing.length - 1];
    if (
      !firstPoint ||
      !lastPoint ||
      firstPoint[0] !== lastPoint[0] ||
      firstPoint[1] !== lastPoint[1]
    ) {
      throw new ApplicationError('region.not_closed', 400, 'region.not_closed');
    }
  }
}

export const regionService = new RegionService(new RegionRepository());
