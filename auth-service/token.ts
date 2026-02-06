import jwt from "jsonwebtoken";
import { config } from "../shared/config";
import { User } from "../shared/types";

export const generateToken = (user: User): string => {
  return jwt.sign(user, config.jwtSecret, { expiresIn: "1h" });
};

export const verifyToken = (token: string): User => {
  return jwt.verify(token, config.jwtSecret) as User;
};
