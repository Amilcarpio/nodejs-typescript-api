import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import {
  connectToDatabase,
  closeDatabaseConnection,
} from './config/database.js';
import setupRoutes from './routes/index.js';
import { corsHandler } from './middlewares/cors.middleware.js';
import { loggingHandler } from './middlewares/logging.middleware.js';
import { routeNotFound } from './middlewares/notFound.middleware.js';
import { server } from './config/config.js';
import logging from './config/logging.js';

dotenv.config();

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
  logging.log('----------------------------------------');
  logging.log('Initializing API');
  logging.log('----------------------------------------');
  application.use(express.urlencoded({ extended: true }));
  application.use(express.json());

  logging.log('----------------------------------------');
  logging.log('Logging & Configuration');
  logging.log('----------------------------------------');
  application.use(loggingHandler);
  application.use(corsHandler);

  logging.log('----------------------------------------');
  logging.log('Define Controller Routing');
  logging.log('----------------------------------------');
  setupRoutes(application);

  application.get('/main/healthcheck', (req, res) => {
    return res.status(200).json({ hello: 'world!' });
  });

  logging.log('----------------------------------------');
  logging.log('Connecting to Database');
  logging.log('----------------------------------------');
  try {
    await connectToDatabase();
    logging.log('Database connected successfully');
  } catch (error) {
    logging.error('Failed to connect to database:', error);
    process.exit(1);
  }

  logging.log('----------------------------------------');
  logging.log('Define Routing Error');
  logging.log('----------------------------------------');
  application.use(routeNotFound);

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
    await closeDatabaseConnection();
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
