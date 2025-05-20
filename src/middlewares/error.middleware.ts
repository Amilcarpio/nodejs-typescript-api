import { Request, Response } from 'express';
import {
  ApplicationError,
  InternalServerError,
} from '../common/errors/application-error';
import logging from '../config/logging';

/**
 * Middleware for global error handling and internationalized error responses.
 * Catches all errors and formats the response for the client.
 */
export function globalErrorHandler<T = Record<string, unknown>>(
  err: Error | ApplicationError,
  req: Request,
  res: Response<T>
): void {
  logging.error('Global error handler caught:', err);

  let statusCode = 500;
  const responseBody: {
    success: boolean;
    message: string;
    error?: string;
    stack?: string;
  } = {
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  if (err instanceof ApplicationError) {
    statusCode = (err as ApplicationError).status || 500;
    if (err.translationKey && typeof req.__ === 'function') {
      let translated: string;
      if (
        err.translationParams &&
        Object.keys(err.translationParams).length > 0
      ) {
        const safeParams: Record<string, string> = {};
        for (const [k, v] of Object.entries(err.translationParams)) {
          safeParams[k] = String(v);
        }
        translated = req.__(err.translationKey, safeParams);
      } else {
        translated = req.__(err.translationKey);
      }
      responseBody.message = translated;
    } else {
      responseBody.message = err.message;
    }
  } else {
    const serverError = new InternalServerError(err.message);
    statusCode = serverError.status || 500;
    responseBody.message = serverError.message;
  }

  logging.error(`Error ${statusCode}: ${responseBody.message}`);

  res.status(statusCode).json(responseBody as T);
}

/**
 * Middleware to handle unhandled promise rejections and uncaught exceptions.
 * Ensures the process exits safely in production.
 */
export function setupUnhandledRejectionHandler(): void {
  process.on('unhandledRejection', (reason: Error) => {
    logging.error('Unhandled Promise Rejection:', reason);
    throw reason;
  });

  process.on('uncaughtException', (error: Error) => {
    logging.error('Uncaught Exception:', error);

    if (process.env.NODE_ENV === 'production') {
      logging.error('Uncaught exception in production. Terminating process...');
      process.exit(1);
    }
  });
}
