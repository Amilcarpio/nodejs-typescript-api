/**
 * Application error classes for consistent error handling and internationalization.
 * Includes base error and common HTTP error types.
 */
export class ApplicationError extends Error {
  public status: number;
  public translationKey?: string;
  public translationParams?: Record<string, unknown>;

  constructor(
    message: string,
    status = 500,
    translationKey?: string,
    translationParams?: Record<string, unknown>
  ) {
    super(message);
    this.status = status;
    this.translationKey = translationKey;
    this.translationParams = translationParams;

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message = 'Validation failed') {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class InternalServerError extends ApplicationError {
  constructor(message = 'Internal server error') {
    super(message, 500, undefined);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class ErrorFactory {
  static createError(message: string): ApplicationError {
    if (message.includes('not found')) {
      return new NotFoundError(message);
    }

    if (
      message.includes('Polygon') ||
      message.includes('validation') ||
      message.includes('required')
    ) {
      return new ValidationError(message);
    }

    if (message.includes('conflict') || message.includes('duplicate')) {
      return new ConflictError(message);
    }

    return new ApplicationError(message);
  }
}
