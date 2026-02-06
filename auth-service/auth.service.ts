import { Role } from "../shared/enums";
import { generateToken } from "./token";

export const login = (userId: string, role: Role): string => {
  return generateToken({ id: userId, role });
};