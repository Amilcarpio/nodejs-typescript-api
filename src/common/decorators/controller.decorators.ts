import { Request, Response, NextFunction } from 'express';
import logging from '../../config/logging';
import { ApplicationError } from '../errors/application-error';

function isErrorWithStatus(
  err: unknown
): err is { status?: number; message?: string; stack?: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    ('message' in err || 'status' in err || 'stack' in err)
  );
}

type ExpressControllerMethod = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void>;

export function CatchErrors() {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<ExpressControllerMethod>
  ) {
    if (!descriptor.value) throw new Error('Descriptor value is undefined');
    const originalMethod = descriptor.value;
    descriptor.value = async function (
      req: Request,
      res: Response,
      next?: NextFunction
    ) {
      try {
        await originalMethod.apply(this, [req, res, next]);
      } catch (error) {
        logging.error(error);
        if (res && !res.headersSent) {
          if (isErrorWithStatus(error)) {
            let message = error.message || 'Internal server error';
            if (
              typeof req.__ === 'function' &&
              error instanceof ApplicationError &&
              error.translationKey
            ) {
              if (
                error.translationParams &&
                Object.keys(error.translationParams).length > 0
              ) {
                const safeParams: Record<string, string> = {};
                for (const [k, v] of Object.entries(error.translationParams)) {
                  safeParams[k] = String(v);
                }
                message = req.__(error.translationKey, safeParams);
              } else {
                message = req.__(error.translationKey);
              }
            }
            res.status(error.status || 500).json({
              message,
              ...(process.env.NODE_ENV !== 'production' && {
                stack: error.stack,
              }),
            });
          } else {
            res.status(500).json({ message: 'Internal server error' });
          }
        } else if (next) {
          next(error);
        }
      }
    };
    return descriptor;
  };
}

export function LogExecutionTime() {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<ExpressControllerMethod>
  ) {
    if (!descriptor.value) throw new Error('Descriptor value is undefined');
    const originalMethod = descriptor.value;
    descriptor.value = async function (
      req: Request,
      res: Response,
      next?: NextFunction
    ) {
      const start = Date.now();
      const result = await originalMethod.apply(this, [req, res, next]);
      const end = Date.now();
      console.log(
        `[${new Date().toISOString()}]  [SERVER-LOG]   Método ${String(
          propertyKey
        )} executado em ${end - start}ms`
      );
      return result;
    };
    return descriptor;
  };
}

export function ValidateParams(params: string[]) {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<ExpressControllerMethod>
  ) {
    if (!descriptor.value) throw new Error('Descriptor value is undefined');
    const originalMethod = descriptor.value;
    descriptor.value = async function (
      req: Request,
      res: Response,
      next?: NextFunction
    ) {
      const missing: string[] = [];
      for (const param of params) {
        if (
          !(param in req.params) &&
          !(param in req.query) &&
          !(param in req.body)
        ) {
          missing.push(param);
        }
      }
      if (missing.length > 0) {
        res.status(400).json({
          message: `Missing required parameter(s): ${missing.join(', ')}`,
        });
        return;
      }
      await originalMethod.apply(this, [req, res, next]);
    };
    return descriptor;
  };
}
