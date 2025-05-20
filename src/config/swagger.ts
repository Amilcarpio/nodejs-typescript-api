/**
 * Swagger/OpenAPI configuration for the OZmap Geolocation API.
 * Sets up swagger-jsdoc and swagger-ui-express for API documentation.
 */
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'OZmap Geolocation API',
    version: '1.0.0',
    description:
      'RESTful API for managing geolocations (regions) with CRUD and geospatial queries.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    'src/modules/region/controllers/*.ts',
    'src/modules/region/dtos/*.ts',
    'src/modules/region/interfaces/*.ts',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
