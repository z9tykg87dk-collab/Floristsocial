export type Notification = {
  id: string;
  title: string;
  message: string;
  recipientId?: string;
  metadata?: Record<string, unknown>;
  status: "pending";
  createdAt: string;
  read: false;
};

const notifications: Notification[] = [];

function createId() {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function toNotificationCopy(notification: Notification): Notification {
  return {
    ...notification,
    metadata: notification.metadata ? { ...notification.metadata } : undefined,
  };
}

export function createNotification(input: {
  title: string;
  message: string;
  recipientId?: string;
  metadata?: Record<string, unknown>;
}): Notification {
  const notification: Notification = {
    id: createId(),
    title: input.title,
    message: input.message,
    recipientId: input.recipientId,
    metadata: input.metadata ? { ...input.metadata } : undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
    read: false,
  };

  notifications.unshift(notification);

  return toNotificationCopy(notification);
}

export function getNotification(id: string): Notification | null {
  const notification = notifications.find((item) => item.id === id);

  if (!notification) {
    return null;
  }

  return toNotificationCopy(notification);
}

export function listNotifications(): Notification[] {
  return notifications.map((notification) => toNotificationCopy(notification));
}
