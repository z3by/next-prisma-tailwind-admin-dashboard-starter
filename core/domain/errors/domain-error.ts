/**
 * Base Domain Error
 * All domain-specific errors should extend this class
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error
 * Thrown when domain validation fails
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Not Found Error
 * Thrown when a requested entity is not found
 */
export class NotFoundError extends DomainError {
  constructor(entityName: string, identifier: string) {
    super(`${entityName} with identifier '${identifier}' not found`);
  }
}

/**
 * Unauthorized Error
 * Thrown when a user is not authorized to perform an action
 */
export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}

/**
 * Conflict Error
 * Thrown when there's a conflict with existing data
 */
export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Invalid Operation Error
 * Thrown when an operation cannot be performed in the current state
 */
export class InvalidOperationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
