"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.id as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const myFloristId = "0d4fbbd0-c02e-46c0-a27a-6fd2a8bb52f3";

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        florists (
          id,
          first_name,
          last_name,
          shop_name,
          profile_image_url
        )
      `,
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "Load messages FULL error:",
        JSON.stringify(error, null, 2),
      );
      return;
    }

    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: myFloristId,
      content: input.trim(),
    });

    if (error) {
      console.error("Send message FULL error:", JSON.stringify(error, null, 2));
      alert("Kunde inte skicka meddelandet");
      return;
    }

    setInput("");
    await loadMessages();
  };

  useEffect(() => {
    if (!conversationId || conversationId === "<din-id>") return;

    loadMessages();

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          loadMessages();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  if (!conversationId || conversationId === "<din-id>") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Florist-chat</h1>
        <p>Ogiltigt chat-id.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Florist-chat</h1>

      <div style={{ marginBottom: 20 }}>
        {messages.length === 0 && <p>Inga meddelanden ännu.</p>}

        {messages.map((msg) => {
          const name =
            msg.florists?.shop_name ||
            `${msg.florists?.first_name || ""} ${msg.florists?.last_name || ""}`.trim() ||
            "Florist";

          return (
            <div key={msg.id} style={{ marginBottom: 12 }}>
              <strong>{name}</strong>
              <p>{msg.content}</p>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv ett meddelande..."
          style={{ padding: 8, flex: 1 }}
        />

        <button onClick={sendMessage}>Skicka</button>
      </div>
    </div>
  );
}
