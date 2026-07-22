import Link from "next/link";
import { listNotifications } from "@/lib/fos/notification/store";

export default function Page() {
  const notifications = listNotifications();

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2.25rem] bg-white p-8 shadow-xl shadow-slate-200/70">
        <Link href="/superadmin/development" className="text-sm font-black text-pink-700">
          ← Tillbaka till Development Center
        </Link>

        <p className="mt-8 inline-flex rounded-full bg-pink-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
          SuperAdmin
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight">Notification Engine</h1>

        <p className="mt-4 text-base font-semibold leading-7 text-slate-600">
          Denna sida är skapad som testyta för Notification Engine. Här kopplar vi nästa steg in riktiga FOS-data och testflöden.
        </p>

        <div className="mt-8 space-y-4">
          {notifications.length === 0 ? (
            <p className="text-sm font-semibold text-slate-600">No notifications.</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm font-black text-slate-950">{notification.title}</p>
                <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>id: {notification.id}</p>
                  <p>status: {notification.status}</p>
                  <p>createdAt: {notification.createdAt}</p>
                  <p>read: {String(notification.read)}</p>
                  {notification.recipientId ? <p>recipientId: {notification.recipientId}</p> : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
