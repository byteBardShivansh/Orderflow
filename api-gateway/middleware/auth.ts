import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../auth-service/token";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = header.split(" ")[1];
    const user = verifyToken(token);

    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}