import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { GeoJSONPolygon } from '../interfaces/region.interface';

/**
 * Data Transfer Object for creating a region.
 * Used for input validation and documentation.
 */
export class CreateRegionDTO {
  @IsNotEmpty({ message: 'region.name_required' })
  @MinLength(3, { message: 'region.name_too_short' })
  @MaxLength(100, { message: 'region.name_too_long' })
  name!: string;

  @IsNotEmpty({ message: 'region.geometry_required' })
  @IsClosedPolygon({ message: 'region.invalid_polygon' })
  geometry!: GeoJSONPolygon;
}

/**
 * Data Transfer Object for updating a region.
 * Used for input validation and documentation.
 */
export class UpdateRegionDTO {
  @MinLength(3, { message: 'region.name_too_short' })
  @MaxLength(100, { message: 'region.name_too_long' })
  name?: string;

  @IsClosedPolygon({ message: 'region.invalid_polygon' })
  geometry?: GeoJSONPolygon;
}

export function IsClosedPolygon(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isClosedPolygon',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (value === undefined) return true;
          if (
            !value ||
            (value as { type?: string }).type !== 'Polygon' ||
            !Array.isArray((value as { coordinates?: unknown }).coordinates)
          ) {
            return false;
          }
          const ring = (value as { coordinates: number[][][] }).coordinates[0];
          if (!Array.isArray(ring) || ring.length < 4) return false;
          const first = ring[0];
          const last = ring[ring.length - 1];
          return (
            Array.isArray(first) &&
            Array.isArray(last) &&
            first[0] === last[0] &&
            first[1] === last[1]
          );
        },
        defaultMessage() {
          return 'region.invalid_polygon';
        },
      },
    });
  };
}
