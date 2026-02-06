import { Request, Response } from "express";
import { placeOrder, getOrders } from "./order.service";

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
    const order = await placeOrder(user.id, amount);
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