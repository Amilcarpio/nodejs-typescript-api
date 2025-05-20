import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Express middleware to automatically validate request body against a DTO class.
 * @param dtoClass The DTO class to validate against
 */
export function validateDto<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req.body) as T;
    const errors = await validate(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      const firstMessage = extractFirstValidationMessage(errors);
      const translated =
        typeof req.__ === 'function' ? req.__(firstMessage) : firstMessage;
      return res.status(400).json({
        message: translated,
        errors: formatValidationErrors(errors),
      });
    }
    req.body = instance;
    next();
  };
}

function extractFirstValidationMessage(errors: ValidationError[]): string {
  for (const err of errors) {
    if (err.constraints) {
      return Object.values(err.constraints)[0];
    }
    if (err.children && err.children.length > 0) {
      const childMsg = extractFirstValidationMessage(err.children);
      if (childMsg) return childMsg;
    }
  }
  return 'Validation failed';
}

function formatValidationErrors(errors: ValidationError[]): unknown[] {
  return errors.map((err) => ({
    property: err.property,
    constraints: err.constraints,
    children: err.children ? formatValidationErrors(err.children) : undefined,
  }));
}
