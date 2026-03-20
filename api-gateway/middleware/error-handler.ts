import { Request, Response, NextFunction } from "express";
import { logger } from "../../shared/logger";
import { AppError, isAppError } from "../../shared/errors";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const correlationId = (req as any).correlationId;

  // Log full error details server-side
  const logPayload: Record<string, any> = { correlationId };
  if (err instanceof Error) {
    logPayload.error = err.message;
    logPayload.stack = err.stack;
  } else {
    logPayload.error = String(err);
  }
  logger.error("Unhandled error", logPayload);

  // Normalize error response
  if (isAppError(err)) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code || "APP_ERROR",
        message: err.statusCode >= 500 ? "Internal server error" : err.message,
        correlationId
      }
    });
  }

  // Fallback 500 for unknown errors
  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
      correlationId
    }
  });
}