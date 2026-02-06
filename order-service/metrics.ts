let totalOrders = 0;
let failedOrders = 0;

export const metrics = {
  incrementOrders() {
    totalOrders++;
  },
  incrementFailures() {
    failedOrders++;
  },
  snapshot() {
    return {
      totalOrders,
      failedOrders
    };
  }
};
