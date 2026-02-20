import type { Request, Response, NextFunction } from "express";

/**
 * Simple in-memory rate limiter middleware (fixed window).
 * - Per-process only; resets on server restart.
 * - For production and horizontally scaled setups, prefer a shared store (e.g., Redis).
 */

const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 100;

// In-memory counter for request counts per IP
const requestCounts: Record<string, number> = {};

// Periodically reset counts to implement a basic fixed window
const interval = setInterval(() => {
  for (const key of Object.keys(requestCounts)) {
    delete requestCounts[key];
  }
}, WINDOW_MS);
// Prevent the interval from keeping the event loop alive (when supported)
(interval as unknown as { unref?: () => void }).unref?.();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  // Normalize IP to a guaranteed string
  // Prefer first 'x-forwarded-for' value, else req.ip, else socket address, else 'unknown'
  const ipHeader = (req.headers["x-forwarded-for"] as string | undefined)
    ?.split(",")[0]
    ?.trim();

  const ip: string =
    ipHeader ||
    (typeof req.ip === "string" ? req.ip : undefined) ||
    (typeof req.socket?.remoteAddress === "string" ? req.socket.remoteAddress : undefined) ||
    "unknown";

  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ error: "Too many requests" });
  }

  return next();
}