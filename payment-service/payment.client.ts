import axios from "axios";
import { config } from "../shared/config";
import { retry } from "../shared/retry";
import { logger } from "../shared/logger";

export const paymentClient = {
  charge: async (orderId: string, amount: number): Promise<void> => {
    await retry(async () => {
      logger.info("Attempting payment charge", { orderId });

      const response = await axios.post(
        `${config.paymentBaseUrl}/charge`,
        { orderId, amount },
        { timeout: config.requestTimeoutMs }
      );

      if (response.status !== 200) {
        throw new Error("Payment failed");
      }
    }, config.maxRetries);
  }
};
