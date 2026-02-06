import { Request, Response, NextFunction } from "express";
import { logger } from "../../shared/logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Unhandled error", {
    error: err?.message,
    correlationId: (req as any).correlationId
  });

  // ⚠ subtle flaw: returning internal error message
  res.status(500).json({ error: err?.message || "Internal server error" });
}