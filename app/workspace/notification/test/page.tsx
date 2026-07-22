import {
  createNotification,
  deleteNotification,
  listNotifications,
  markNotificationRead,
  markNotificationUnread,
} from "@/lib/fos/notification/store";

export default function NotificationTestPage() {
  const existingNotifications = listNotifications();

  if (existingNotifications.length === 0) {
    createNotification({
      title: "Notification Test",
      message: "This notification was created by the Notification Test page.",
    });
  }

  const notifications = listNotifications();

  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
          FOS Notification Test
        </p>
        <h1 className="mt-2 text-4xl font-black">
          Notification Store Test Page
        </h1>
      </div>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Notification count</h2>
        <p className="mt-3 text-sm text-stone-600">{notifications.length}</p>
      </section>

      <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Notifications</h2>

        <div className="mt-5 grid gap-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200"
            >
              <p className="font-black">id: {notification.id}</p>
              <p className="text-sm text-stone-600">title: {notification.title}</p>
              <p className="text-sm text-stone-600">message: {notification.message}</p>
              <p className="text-sm text-stone-600">status: {notification.status}</p>
              <p className="text-sm text-stone-600">read: {String(notification.read)}</p>
              <p className="text-sm text-stone-600">createdAt: {notification.createdAt}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Available lifecycle operations</h2>
        <div className="mt-4 space-y-2 text-sm text-stone-600">
          <p>✓ markNotificationRead()</p>
          <p>✓ markNotificationUnread()</p>
          <p>✓ deleteNotification()</p>
        </div>
      </section>
    </main>
  );
}

void markNotificationRead;
void markNotificationUnread;
void deleteNotification;
