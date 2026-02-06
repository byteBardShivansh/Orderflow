import { Role, OrderStatus } from "./enums";

export interface User {
  id: string;
  role: Role;
}

export interface Order {
  id: string;
  userId: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
}