export const config = {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    jwtSecret: process.env.JWT_SECRET || "dev-secret",
    paymentBaseUrl: process.env.PAYMENT_URL || "https://fake-payments",
    requestTimeoutMs: 2000,
    maxRetries: 3
  };  