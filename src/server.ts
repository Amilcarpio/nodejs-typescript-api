import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { connectToDatabase, initializeModels } from './config/database';
import { corsHandler } from './middlewares/cors.middleware';
import { loggingHandler } from './middlewares/logging.middleware';
import { routeNotFound } from './middlewares/notFound.middleware';
import {
  globalErrorHandler,
  setupUnhandledRejectionHandler,
} from './middlewares/error.middleware';
import { server } from './config/config';
import logging from './config/logging';
import { registerControllers } from './common/decorators/route.decorators';
import { RegionController } from './modules/region/controllers/region.controller';
import { setupI18n } from './I18n/i18n';
import { setupSwagger } from './config/swagger';

dotenv.config();

/**
 * Main server entry point. Sets up Express, middleware, controllers, and error handling.
 * Starts the HTTP server and handles graceful shutdown.
 */

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
  logging.log('----------------------------------------');
  logging.log('Initializing API');
  logging.log('----------------------------------------');
  application.use(express.urlencoded({ extended: true }));
  application.use(express.json());

  const i18n = setupI18n();
  application.use(i18n.init as unknown as express.RequestHandler);

  logging.log('----------------------------------------');
  logging.log('Logging & Configuration');
  logging.log('----------------------------------------');
  application.use(loggingHandler);
  application.use(corsHandler);

  logging.log('----------------------------------------');
  logging.log('Define Controller Routing');
  logging.log('----------------------------------------');
  registerControllers(application, [RegionController]);

  // Setup Swagger/OpenAPI documentation
  setupSwagger(application);

  try {
    logging.log('----------------------------------------');
    logging.log('Connecting to Database...');
    logging.log('----------------------------------------');
    await connectToDatabase();
    logging.log('----------------------------------------');
    logging.log('Database connection established');
    logging.log('----------------------------------------');

    logging.log('----------------------------------------');
    logging.log('Initializing Models...');
    logging.log('----------------------------------------');
    await initializeModels();
    logging.log('----------------------------------------');
    logging.log('Models initialized successfully');
    logging.log('----------------------------------------');
  } catch (error) {
    logging.error('Failed to connect to database:', error);
    process.exit(1);
  }

  logging.log('----------------------------------------');
  logging.log('Configure Error Handlers');
  logging.log('----------------------------------------');
  application.use(routeNotFound);
  application.use(globalErrorHandler);

  setupUnhandledRejectionHandler();

  logging.log('----------------------------------------');
  logging.log('Starting Server');
  logging.log('----------------------------------------');
  httpServer = http.createServer(application);
  httpServer.listen(server.PORT, () => {
    logging.log('----------------------------------------');
    logging.log(`Server started on ${server.SERVER_HOSTNAME}:${server.PORT}`);
    logging.log('----------------------------------------');
  });
};

export const Shutdown = async (callback?: () => void) => {
  try {
    if (!httpServer) {
      logging.log('----------------------------------------');
      logging.log('Server is not running');
      logging.log('----------------------------------------');
      return;
    }
    httpServer.close(callback);
    logging.log('----------------------------------------');
    logging.log('Server and database connections closed');
    logging.log('----------------------------------------');
  } catch (error) {
    logging.log('----------------------------------------');
    logging.error('Error during shutdown:', error);
    logging.log('----------------------------------------');
  }
};

process.on('SIGINT', () => {
  logging.log('----------------------------------------');
  logging.log('SIGINT signal received');
  logging.log('----------------------------------------');

  Shutdown(() => {
    logging.log('----------------------------------------');
    logging.log('Server closed through SIGINT');
    logging.log('----------------------------------------');

    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logging.log('----------------------------------------');
  logging.log('SIGTERM signal received');
  logging.log('----------------------------------------');

  Shutdown(() => {
    logging.log('----------------------------------------');
    logging.log('Server closed through SIGTERM');
    logging.log('----------------------------------------');

    process.exit(0);
  });
});

Main().catch((error) => {
  logging.log('----------------------------------------');
  logging.error('Failed to start server:', error);
  logging.log('----------------------------------------');

  process.exit(1);
});
