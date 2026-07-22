export type NotificationHandlerInput = {
  title: string;
  message: string;
  recipientId?: string;
  metadata?: Record<string, unknown>;
};

export type NotificationHandlerResult = {
  accepted: boolean;
  notificationId: string;
  createdAt: string;
};

import { createNotification } from "@/lib/fos/notification/store";

export function handleNotification(
  input: NotificationHandlerInput
): NotificationHandlerResult {
  if (input.title.trim().length === 0) {
    throw new Error("Notification title is required.");
  }

  if (input.message.trim().length === 0) {
    throw new Error("Notification message is required.");
  }

  const notification = createNotification({
    title: input.title,
    message: input.message,
    recipientId: input.recipientId,
    metadata: input.metadata,
  });

  return {
    accepted: true,
    notificationId: notification.id,
    createdAt: notification.createdAt,
  };
}
