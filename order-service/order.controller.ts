import { Request, Response } from "express";
import { placeOrder, getOrders, cancelOrder } from "./order.service";

export const createOrderHandler = async (
  req: Request,
  res: Response
) => {
  const { amount } = req.body;
  const user = (req as any).user;

  if (!amount || typeof amount !== "number") {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const order = await placeOrder(user.id, amount, req);
    return res.status(201).json(order);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const listOrdersHandler = (
  req: Request,
  res: Response
) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const orders = getOrders(page, limit);
  return res.json(orders);
};

export const cancelOrderHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params as any;

  try {
    const order = await cancelOrder(id);
    return res.status(200).json(order);
  } catch (err: any) {
    const status = err?.statusCode || 500;
    return res.status(status).json({ error: err.message });
  }
};