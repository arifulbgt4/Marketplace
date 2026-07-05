export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  RATE_LIMITED = "RATE_LIMITED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  BUSINESS_RULE = "BUSINESS_RULE",
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly requestId?: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    options?: { requestId?: string; details?: Record<string, unknown> },
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.requestId = options?.requestId ?? randomUUID();
    this.details = options?.details;
  }

  public toSafeJSON() {
    return {
      code: this.code,
      message: this.message,
      requestId: this.requestId,
      details: this.details ?? undefined,
    };
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    requestId?: string,
  ) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, { requestId, details });
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required", requestId?: string) {
    super(ErrorCode.AUTHENTICATION_ERROR, message, 401, { requestId });
  }
}

export class AuthorizationError extends AppError {
  constructor(
    message: string = "Insufficient permissions",
    requestId?: string,
  ) {
    super(ErrorCode.AUTHORIZATION_ERROR, message, 403, { requestId });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string, requestId?: string) {
    const message = id
      ? `${resource} with ID ${id} not found`
      : `${resource} not found`;
    super(ErrorCode.NOT_FOUND, message, 404, { requestId });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, requestId?: string) {
    super(ErrorCode.CONFLICT, message, 409, { requestId });
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, requestId?: string) {
    super(ErrorCode.BUSINESS_RULE, message, 422, { requestId });
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests", requestId?: string) {
    super(ErrorCode.RATE_LIMITED, message, 429, { requestId });
  }
}

export type Result<T> =
  { success: true; data: T } | { success: false; error: AppError };

export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

export function fail<T>(error: AppError): Result<T> {
  return { success: false, error };
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function asAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof ZodError) {
    return new ValidationError("Request validation failed", {
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }
  return new AppError(
    ErrorCode.INTERNAL_ERROR,
    "An unexpected error occurred",
    500,
  );
}
import { randomUUID } from "crypto";
import { ZodError } from "zod";
