import {
  SchemaProperty,
  Timestamps,
  Index,
  SchemaOptions,
  generateSchema,
} from '../../../common/decorators/model.decorators';
import { IRegion, IRegionDocument } from '../interfaces/region.interface';
import mongoose from 'mongoose';

/**
 * Region model class using decorators for schema definition.
 * Represents the Region entity in MongoDB.
 */
@Timestamps()
@SchemaOptions({ versionKey: false })
@Index({ name: 1 })
export class Region implements IRegion {
  @SchemaProperty({
    type: String,
    required: [true, 'Region name is required'],
    trim: true,
    index: true,
  })
  name!: string;

  @SchemaProperty({
    type: Object,
    required: [true, 'Region geometry is required'],
    index: '2dsphere',
  })
  geometry!: {
    type: 'Polygon';
    coordinates: number[][][];
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const RegionSchema = generateSchema(Region);
RegionSchema.set('autoIndex', true);

export const RegionModel = mongoose.model<IRegionDocument>(
  'Region',
  RegionSchema,
  undefined,
  { overwriteModels: true }
);
