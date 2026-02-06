import { Request, Response } from "express";
import { login } from "./auth.service";
import { Role } from "../shared/enums";

export const loginHandler = (req: Request, res: Response) => {
  const { userId, role } = req.body;

  if (!userId || !role || !Object.values(Role).includes(role)) {
    return res.status(400).json({ error: "Invalid login payload" });
  }

  const token = login(userId, role);
  return res.json({ token });
};