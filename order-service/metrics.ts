let totalOrders = 0;
let failedOrders = 0;
let cancelledOrders = 0;
let refundedAmount = 0;

export const metrics = {
  incrementOrders() {
    totalOrders++;
  },
  incrementFailures() {
    failedOrders++;
  },
  incrementCancellations() {
    cancelledOrders++;
  },
  addRefund(amount: number) {
    refundedAmount += amount;
  },
  snapshot() {
    return {
      totalOrders,
      failedOrders,
      cancelledOrders,
      refundedAmount
    };
  }
};
