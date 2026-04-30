"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function StartChatButton({ floristId }: { floristId: string }) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  async function startChat() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Du måste vara inloggad.");
      return;
    }

    if (user.id === floristId) {
      alert("Du kan inte chatta med dig själv.");
      return;
    }

    // 1. Kolla om chat redan finns
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `and(florist_1.eq.${user.id},florist_2.eq.${floristId}),and(florist_1.eq.${floristId},florist_2.eq.${user.id})`
      )
      .maybeSingle();

    let conversationId;

    if (existing) {
      conversationId = existing.id;
    } else {
      // 2. Skapa ny chat
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          florist_1: user.id,
          florist_2: floristId,
        })
        .select()
        .single();

      if (error) {
        alert("Kunde inte starta chat");
        return;
      }

      conversationId = data.id;
    }

    // 3. Gå till chat
    router.push(`/florist-chat?c=${conversationId}`);
  }

  return (
    <button
      onClick={startChat}
      style={{
        padding: "6px 10px",
        borderRadius: "999px",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      💬 Chatta
    </button>
  );
}
