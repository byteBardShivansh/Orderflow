import { Order } from "../shared/types";
import { OrderStatus } from "../shared/enums";
import { v4 as uuid } from "uuid";

const orders: Order[] = [];

export const createOrder = (userId: string, amount: number): Order => {
  const order: Order = {
    id: uuid(),
    userId,
    amount,
    status: OrderStatus.CREATED,
    createdAt: new Date()
  };

  orders.push(order);
  return order;
};

export const findById = (id: string): Order | undefined => {
  return orders.find(o => o.id === id);
};

export const updateStatus = (
  id: string,
  status: OrderStatus
): Order | undefined => {
  const order = findById(id);
  if (order) {
    order.status = status;
  }
  return order;
};

export const listOrders = (page: number, limit: number): Order[] => {
  const start = (page - 1) * limit;
  return orders.slice(start, start + limit);
};