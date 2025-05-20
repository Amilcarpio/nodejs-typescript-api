import { Request, Response } from 'express';

/**
 * Middleware for handling 404 Not Found errors.
 * Returns a standardized not found response.
 */
export function routeNotFound(req: Request, res: Response) {
  const error = new Error('Not found');
  logging.warning(error);

  return res.status(404).json({
    error: {
      message: error.message,
    },
  });
}
