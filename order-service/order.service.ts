import * as repo from "./order.repository";
import { paymentClient } from "../payment-service/payment.client";
import { OrderStatus } from "../shared/enums";
import { metrics } from "./metrics";
import { logger } from "../shared/logger";
import { isEnabled } from "../shared/featureFlags";

export const placeOrder = async (
  userId: string,
  amount: number
) => {
  const order = repo.createOrder(userId, amount);
  metrics.incrementOrders();

  try {
    await paymentClient.charge(order.id, amount);

    repo.updateStatus(order.id, OrderStatus.PAID);

    logger.info("Order paid", { orderId: order.id });
  } catch (err: any) {
    repo.updateStatus(order.id, OrderStatus.FAILED);
    metrics.incrementFailures();

    logger.error("Payment failed", {
      orderId: order.id,
      error: err?.message
    });

    throw err;
  }

  return order;
};

export const getOrders = (page: number, limit: number) => {
  return repo.listOrders(page, limit);
};