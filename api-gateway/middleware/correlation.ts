import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";

export function correlation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const incoming = req.headers["x-correlation-id"];
  const id = typeof incoming === "string" ? incoming : uuid();

  (req as any).correlationId = id;
  res.setHeader("x-correlation-id", id);

  next();
}
