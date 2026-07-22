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

function createNotificationId() {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function handleNotification(
  input: NotificationHandlerInput
): NotificationHandlerResult {
  if (input.title.trim().length === 0) {
    throw new Error("Notification title is required.");
  }

  if (input.message.trim().length === 0) {
    throw new Error("Notification message is required.");
  }

  return {
    accepted: true,
    notificationId: createNotificationId(),
    createdAt: new Date().toISOString(),
  };
}
