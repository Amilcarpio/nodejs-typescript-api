import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for logging incoming requests and responses.
 * Logs method, URL, IP, and status code for each request.
 */
export function loggingHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logging.log(
    `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on('finish', () => {
    logging.log(
      `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
    );
  });

  next();
}
