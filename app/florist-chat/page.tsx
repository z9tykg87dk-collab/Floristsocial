import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFloristChatList } from "@/lib/chat/getFloristChatList";

export default async function FloristChatPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-6">Inte inloggad</div>;
  }

  const chats = await getFloristChatList(supabase, user.id);

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Florist Chat</h1>

      {chats.length === 0 ? (
        <p>Inga konversationer ännu</p>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <Link
              key={chat.conversation_id}
              href={`/florist-chat/${chat.conversation_id}`}
              className="block rounded-xl border bg-white p-4 shadow-sm transition hover:bg-gray-50"
            >
              <h2 className="font-semibold">{chat.title}</h2>

              <p className="text-sm text-gray-500">
                Status: {chat.outcome}
              </p>

              <p className="text-sm text-gray-500">
                Senaste aktivitet:{" "}
                {chat.last_message_at
                  ? new Date(chat.last_message_at).toLocaleString("sv-SE")
                  : "Ingen aktivitet ännu"}
              </p>

              <div className="mt-4 space-y-2">
                {chat.participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-sm">
                    {p.logo_url || p.avatar_url ? (
                      <img
                        src={p.logo_url || p.avatar_url || ""}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                    )}

                    <div>
                      <div>{p.display_name}</div>
                      <div className="text-xs text-gray-400">
                        {p.role}
                        {p.florist_name ? ` · ${p.florist_name}` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {chat.economy ? (
                <div className="mt-4 border-t pt-3 text-sm">
                  <p>Ordervärde: {chat.economy.order_value ?? 0} kr</p>

                  {chat.economy.can_view_all ? (
                    <>
                      <p>Säljande florist: {chat.economy.seller_commission ?? 0} kr</p>
                      <p>Utförande florist: {chat.economy.executor_commission ?? 0} kr</p>
                      <p>FloristSocial: {chat.economy.platform_commission ?? 0} kr</p>
                      <p>Kortavgift: {chat.economy.payment_fee ?? 0} kr</p>
                    </>
                  ) : (
                    <p>Din intäkt: {chat.economy.own_commission ?? 0} kr</p>
                  )}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
