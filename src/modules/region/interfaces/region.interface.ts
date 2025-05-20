import { IEntity } from '../../../common/interfaces/entity.interface';
import { Document, Types } from 'mongoose';

/**
 * Custom types for GeoJSON
 */
export type GeoJSONPoint = {
  type: 'Point';
  coordinates: [number, number];
};

export type GeoJSONPolygon = {
  type: 'Polygon';
  coordinates: number[][][];
};

/**
 * Interface representing a Region.
 * Used for type safety and documentation.
 */
export interface IRegion extends IEntity {
  name: string;
  geometry: GeoJSONPolygon;
}

/**
 * Query parameters for searching regions
 */
export interface FindByPointQuery {
  longitude: number;
  latitude: number;
}

export interface FindByDistanceQuery extends FindByPointQuery {
  distance: number; // distance in meters
  unit?: 'meters' | 'kilometers' | 'miles';
}

export interface FindByAddressQuery {
  address: string;
  countryCode?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Region:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Region ID
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           description: Region name
 *           example: São Paulo
 *         geometry:
 *           $ref: '#/components/schemas/GeoJSONPolygon'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2025-05-19T21:00:00.000Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2025-05-19T21:00:00.000Z'
 *     RegionInput:
 *       type: object
 *       required:
 *         - name
 *         - geometry
 *       properties:
 *         name:
 *           type: string
 *           example: São Paulo
 *         geometry:
 *           $ref: '#/components/schemas/GeoJSONPolygon'
 *       example:
 *         name: São Paulo
 *         geometry:
 *           type: Polygon
 *           coordinates:
 *             - - [ -46.693419, -23.568704 ]
 *               - [ -46.641146, -23.568704 ]
 *               - [ -46.641146, -23.525024 ]
 *               - [ -46.693419, -23.525024 ]
 *               - [ -46.693419, -23.568704 ]
 *     GeoJSONPolygon:
 *       type: object
 *       required:
 *         - type
 *         - coordinates
 *       properties:
 *         type:
 *           type: string
 *           enum: [Polygon]
 *           example: Polygon
 *         coordinates:
 *           type: array
 *           description: Array of linear rings (first is outer, rest are holes)
 *           items:
 *             type: array
 *             items:
 *               type: array
 *               items:
 *                 type: number
 *                 description: [longitude, latitude]
 *           example:
 *             - - [ -46.693419, -23.568704 ]
 *               - [ -46.641146, -23.568704 ]
 *               - [ -46.641146, -23.525024 ]
 *               - [ -46.693419, -23.525024 ]
 *               - [ -46.693419, -23.568704 ]
 *
 *   examples:
 *     ValidRegion:
 *       summary: Valid region payload
 *       value:
 *         name: São Paulo
 *         geometry:
 *           type: Polygon
 *           coordinates:
 *             - - [ -46.693419, -23.568704 ]
 *               - [ -46.641146, -23.568704 ]
 *               - [ -46.641146, -23.525024 ]
 *               - [ -46.693419, -23.525024 ]
 *               - [ -46.693419, -23.568704 ]
 *     InvalidRegion:
 *       summary: Invalid region payload (polygon not closed)
 *       value:
 *         name: Invalid
 *         geometry:
 *           type: Polygon
 *           coordinates:
 *             - - [ 0, 0 ]
 *               - [ 1, 0 ]
 *               - [ 1, 1 ]
 */
export interface IRegionDocument
  extends Omit<IRegion, 'id' | '_id'>,
    Document<Types.ObjectId> {
  _id: Types.ObjectId;
}
