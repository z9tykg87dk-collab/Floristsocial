import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFloristChatList } from "@/lib/chat/getFloristChatList";

export default async function FloristChatPage() {
  const supabase = await createSupabaseServerClient();

  // 🔐 Hämta user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-6">Inte inloggad</div>;
  }

  // 👉 Tillfälligt: vi antar florist
  const viewerRole: "florist" | "admin" | "super_admin" = "florist";

  // 👉 TODO senare: hämta från DB
  const viewerFloristId: string | null = null;

  const chats = await getFloristChatList(
    supabase,
    user.id,
    viewerRole,
    viewerFloristId
  );

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Florist Chat</h1>

      {chats.length === 0 ? (
        <p>Inga konversationer ännu</p>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat.conversation_id}
              className="border rounded-xl p-4"
            >
              {/* Titel */}
              <h2 className="font-semibold">{chat.title}</h2>

              {/* Status */}
              <p className="text-sm text-gray-500">
                Status: {chat.outcome}
              </p>

              {/* Datum */}
              <p className="text-sm text-gray-500">
                Senaste aktivitet:{" "}
                {chat.last_message_at
                  ? new Date(chat.last_message_at).toLocaleString("sv-SE")
                  : "Ingen aktivitet ännu"}
              </p>

              {/* Deltagare */}
              <div className="mt-3 space-y-2">
                {chat.participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    {p.logo_url || p.avatar_url ? (
                      <img
                        src={p.logo_url || p.avatar_url || ""}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                    )}

                    <span>{p.display_name}</span>
                    <span className="text-gray-400">· {p.role}</span>
                  </div>
                ))}
              </div>

              {/* 💰 Economy (rollbaserad) */}
              {chat.economy ? (
                <div className="mt-4 text-sm border-t pt-3">
                  <p>
                    Ordervärde: {chat.economy.order_value ?? 0} kr
                  </p>

                  {chat.economy.can_view_all ? (
                    <>
                      <p>
                        Säljande florist:{" "}
                        {chat.economy.seller_commission ?? 0} kr
                      </p>
                      <p>
                        Utförande florist:{" "}
                        {chat.economy.executor_commission ?? 0} kr
                      </p>
                      <p>
                        FloristSocial:{" "}
                        {chat.economy.platform_commission ?? 0} kr
                      </p>
                      <p>
                        Kortavgift:{" "}
                        {chat.economy.payment_fee ?? 0} kr
                      </p>
                    </>
                  ) : (
                    <p>
                      Din intäkt:{" "}
                      {chat.economy.own_commission ?? 0} kr
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
