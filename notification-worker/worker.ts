import { notificationQueue, NotificationEvent } from "./queue";
import { logger } from "../shared/logger";

export const sendNotification = async (event: NotificationEvent): Promise<void> => {
  logger.info("Processing notification", { 
    orderId: event.orderId, 
    userId: event.userId,
    status: event.status 
  });

  try {
    // Simulate sending notification (email, SMS, push notification, etc.)
    await new Promise(resolve => setTimeout(resolve, 50));

    logger.info("Notification sent successfully", {
      orderId: event.orderId,
      userId: event.userId,
      timestamp: event.timestamp
    });

    // Here you would integrate with actual notification services:
    // - Email service (SendGrid, AWS SES, etc.)
    // - SMS service (Twilio, etc.)
    // - Push notification service (Firebase, etc.)
    
  } catch (error) {
    logger.error("Failed to send notification", {
      orderId: event.orderId,
      userId: event.userId,
      error: error instanceof Error ? error.message : "Unknown error"
    });
    throw error;
  }
};

export const startNotificationWorker = (): void => {
  logger.info("Starting notification worker");

  notificationQueue.process(async (event: NotificationEvent) => {
    await sendNotification(event);
  });

  logger.info("Notification worker started and processing queue");
};

// Graceful shutdown handler
process.on('SIGINT', () => {
  logger.info("Notification worker shutting down");
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info("Notification worker shutting down");
  process.exit(0);
});