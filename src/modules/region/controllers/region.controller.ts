import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
} from '../../../common/decorators/route.decorators';
import { regionService } from '../services/region.service';
import {
  CatchErrors,
  LogExecutionTime,
  ValidateParams,
} from '../../../common/decorators/controller.decorators';
import { Request, Response } from 'express';
import { validateDto } from '../../../middlewares/validate-dto.middleware';
import { CreateRegionDTO, UpdateRegionDTO } from '../dtos/region.dto';

/**
 * @swagger
 * tags:
 *   name: Regions
 *   description: Region management and geospatial queries
 */

/**
 * @swagger
 * /api/regions/:
 *   get:
 *     summary: Get all regions
 *     tags: [Regions]
 *     responses:
 *       200:
 *         description: List of all regions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Region'
 *   post:
 *     summary: Create a new region
 *     tags: [Regions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegionInput'
 *     responses:
 *       201:
 *         description: Region created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Region'
 *
 * /api/regions/{id}:
 *   get:
 *     summary: Get a region by ID
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Region'
 *       404:
 *         description: Region not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Region not found
 *   put:
 *     summary: Update a region
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Region ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegionInput'
 *     responses:
 *       200:
 *         description: Region updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Region'
 *       404:
 *         description: Region not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Region not found
 *   delete:
 *     summary: Delete a region
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Region ID
 *     responses:
 *       204:
 *         description: Region deleted
 *       404:
 *         description: Region not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Region not found
 *
 * /api/regions/query/point:
 *   get:
 *     summary: Find regions containing a point
 *     tags: [Regions]
 *     parameters:
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude
 *     responses:
 *       200:
 *         description: Regions containing the point
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Region'
 *
 * /api/regions/query/distance:
 *   get:
 *     summary: Find regions within a distance from a point
 *     tags: [Regions]
 *     parameters:
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude
 *       - in: query
 *         name: distance
 *         schema:
 *           type: number
 *         required: true
 *         description: Distance in meters
 *       - in: query
 *         name: unit
 *         schema:
 *           type: string
 *           enum: [meters, kilometers, miles]
 *         required: false
 *         description: Distance unit
 *     responses:
 *       200:
 *         description: Regions within the distance
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Region'
 *
 * /api/regions/query/address:
 *   get:
 *     summary: Find regions by address
 *     tags: [Regions]
 *     parameters:
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Address to geocode
 *       - in: query
 *         name: countryCode
 *         schema:
 *           type: string
 *         required: false
 *         description: Country code (e.g., BR, US)
 *     responses:
 *       200:
 *         description: Regions containing the address
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Region'
 */

/**
 * Controller for managing region resources (CRUD and queries).
 * Handles all region-related API endpoints.
 */
@Controller('/api/regions')
export class RegionController {
  constructor(private readonly service = regionService) {}

  @Get('/')
  @LogExecutionTime()
  @CatchErrors()
  async getAll(req: Request, res: Response): Promise<void> {
    const regions = await this.service.getAll();
    res.status(200).json(regions);
  }

  @Get('/:id')
  @LogExecutionTime()
  @CatchErrors()
  @ValidateParams(['id'])
  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const region = await this.service.getById(id);
    res.status(200).json(region);
  }

  @Post('/', validateDto(CreateRegionDTO))
  @LogExecutionTime()
  @CatchErrors()
  async create(req: Request, res: Response): Promise<void> {
    const region = await this.service.create(req.body);
    res.status(201).json(region);
  }

  @Put('/:id', validateDto(UpdateRegionDTO))
  @LogExecutionTime()
  @CatchErrors()
  @ValidateParams(['id'])
  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const region = await this.service.update(id, req.body);
    res.status(200).json(region);
  }

  @Delete('/:id')
  @LogExecutionTime()
  @CatchErrors()
  @ValidateParams(['id'])
  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.service.delete(id);
    res.status(204).send();
  }

  @Get('/query/point')
  @LogExecutionTime()
  @CatchErrors()
  @ValidateParams(['longitude', 'latitude'])
  async findRegionsByPoint(req: Request, res: Response): Promise<void> {
    const longitude = parseFloat(req.query.longitude as string);
    const latitude = parseFloat(req.query.latitude as string);
    const regions = await this.service.findRegionsByPoint({
      longitude,
      latitude,
    });
    res.status(200).json(regions);
  }

  @Get('/query/distance')
  @LogExecutionTime()
  @CatchErrors()
  @ValidateParams(['longitude', 'latitude', 'distance'])
  async findRegionsByDistance(req: Request, res: Response): Promise<void> {
    const longitude = parseFloat(req.query.longitude as string);
    const latitude = parseFloat(req.query.latitude as string);
    const distance = parseFloat(req.query.distance as string);
    const unit = req.query.unit as
      | 'meters'
      | 'kilometers'
      | 'miles'
      | undefined;
    const regions = await this.service.findRegionsByDistance({
      longitude,
      latitude,
      distance,
      unit,
    });
    res.status(200).json(regions);
  }

  @Get('/query/address')
  @LogExecutionTime()
  @CatchErrors()
  @ValidateParams(['address'])
  async findRegionsByAddress(req: Request, res: Response): Promise<void> {
    const address = req.query.address as string;
    const countryCode = req.query.countryCode as string | undefined;
    const regions = await this.service.findRegionsByAddress({
      address,
      countryCode,
    });
    res.status(200).json(regions);
  }
}
