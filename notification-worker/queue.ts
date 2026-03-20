export interface NotificationEvent {
  orderId: string;
  userId: string;
  amount: number;
  status: string;
  timestamp: Date;
}

export interface Queue {
  enqueue(event: NotificationEvent): Promise<void>;
  dequeue(): Promise<NotificationEvent | null>;
  process(callback: (event: NotificationEvent) => Promise<void>): Promise<void>;
}

export class InMemoryQueue implements Queue {
  private queue: NotificationEvent[] = [];
  private processing = false;

  async enqueue(event: NotificationEvent): Promise<void> {
    this.queue.push(event);
  }

  async dequeue(): Promise<NotificationEvent | null> {
    return this.queue.shift() || null;
  }

  async process(callback: (event: NotificationEvent) => Promise<void>): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (true) {
      const event = await this.dequeue();
      if (!event) {
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }

      try {
        await callback(event);
      } catch (error) {
        console.error('Failed to process notification event:', error);
      }
    }
  }
}

export const notificationQueue = new InMemoryQueue();