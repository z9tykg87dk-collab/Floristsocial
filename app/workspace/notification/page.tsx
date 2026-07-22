import { listNotifications } from "@/lib/fos/notification/store";

export default async function NotificationPage({
  searchParams,
}: {
  searchParams?: Promise<{
    filter?: string;
  }>;
}) {
  const params = await searchParams;
  const notifications = listNotifications();
  const unreadNotifications = notifications.filter((notification) => !notification.read).length;
  const sortedNotifications = [...notifications].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );
  const filter =
    params?.filter === "unread" || params?.filter === "read"
      ? params.filter
      : "all";
  const filteredNotifications = sortedNotifications.filter((notification) => {
    if (filter === "unread") {
      return notification.read === false;
    }

    if (filter === "read") {
      return notification.read === true;
    }

    return true;
  });

  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black">Notification Center</h1>
      </div>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Overview</h2>
        <p className="mt-3 text-sm text-stone-600">Total notifications: {notifications.length}</p>
        <p className="mt-1 text-sm text-stone-600">Unread notifications: {unreadNotifications}</p>
      </section>

      <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Notifications</h2>

        <p className="mt-3 text-sm text-stone-600">Current filter: {filter}</p>
        <p className="mt-1 text-sm text-stone-600">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </p>

        {filteredNotifications.length === 0 ? (
          <p className="mt-3 text-sm text-stone-600">No notifications available.</p>
        ) : (
          <div className="mt-5 grid gap-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200"
              >
                <p className="text-sm text-stone-600">title: {notification.title}</p>
                <p className="text-sm text-stone-600">message: {notification.message}</p>
                <p className="text-sm text-stone-600">status: {notification.status}</p>
                <p className="text-sm text-stone-600">read: {String(notification.read)}</p>
                <p className="text-sm text-stone-600">createdAt: {notification.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
