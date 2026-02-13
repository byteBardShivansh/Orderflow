import { Request, Response, NextFunction } from "express";

const requestCounts: Record<string, number> = {};

export function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = req.ip;

  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > 100) {
    return res.status(429).json({ error: "Too many requests" });
  }

  next();
}