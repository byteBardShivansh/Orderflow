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

export const cancelOrder = async (orderId: string) => {
  const order = repo.findById(orderId);
  if (!order) {
    const err = new Error("Order not found");
    (err as any).statusCode = 404;
    throw err;
  }

  if (order.status === OrderStatus.CANCELLED) {
    return order; // idempotent: already cancelled
  }
  if (order.status !== OrderStatus.PAID) {
    const err = new Error("Only PAID orders can be cancelled");
    (err as any).statusCode = 400;
    throw err;
  }

  try {
    await paymentClient.refund(order.id, order.amount);
    // Re-read to guard against concurrent operations
    const latest = repo.findById(order.id);
    if (!latest || latest.status === OrderStatus.CANCELLED) {
      return latest || order;
    }
    repo.updateStatus(order.id, OrderStatus.CANCELLED);
    metrics.incrementCancellations();
    metrics.addRefund(order.amount);
    logger.info("Order cancelled and refunded", { orderId: order.id });
  } catch (err: any) {
    logger.error("Refund failed", { orderId: order.id, error: err?.message });
    throw err;
  }

  return repo.findById(order.id);
};

export const getOrders = (page: number, limit: number) => {
  return repo.listOrders(page, limit);
};