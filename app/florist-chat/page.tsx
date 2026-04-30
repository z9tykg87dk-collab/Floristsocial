"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

export default function FloristChatPage() {
  const supabase = createSupabaseBrowserClient();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("c");

  useEffect(() => {
    loadConversations();

    if (conversationId) {
      openChat({ id: conversationId });
    }
  }, []);
  async function loadConversations() {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });

    setConversations(data || []);
  }

  async function openChat(convo: any) {
    setActiveChat(convo);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convo.id)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  async function sendMessage() {
    if (!text.trim() || !activeChat) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("messages").insert({
      conversation_id: activeChat.id,
      sender_id: user?.id,
      content: text,
    });

    setText("");
    openChat(activeChat);
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Florist Chat</h1>

      <div style={{ display: "flex", gap: "1rem" }}>

        {/* SIDEBAR */}
        <div style={sidebar}>
          <h3>Konversationer</h3>

          {conversations.length === 0 ? (
            <p>Inga chattar ännu</p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                style={chatItem}
                onClick={() => openChat(c)}
              >
                Chat {c.id.slice(0, 4)}
              </div>
            ))
          )}
        </div>

        {/* CHAT AREA */}
        <div style={chatBox}>
          {!activeChat ? (
            <p>Välj en chat</p>
          ) : (
            <>
              <div style={messagesBox}>
                {messages.map((m) => (
                  <div key={m.id} style={message}>
                    {m.content}
                  </div>
                ))}
              </div>

              <div style={inputRow}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={input}
                  placeholder="Skriv meddelande..."
                />

                <button onClick={sendMessage} style={sendBtn}>
                  Skicka
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </main>
  );
}

/* STYLES */

const sidebar = {
  width: "250px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "1rem",
  background: "#fff",
};

const chatItem = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
};

const chatBox = {
  flex: 1,
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "1rem",
  background: "#fff",
};

const messagesBox = {
  height: "400px",
  overflowY: "auto" as const,
  marginBottom: "1rem",
};

const message = {
  padding: "8px",
  borderRadius: "8px",
  background: "#f3f4f6",
  marginBottom: "6px",
};

const inputRow = {
  display: "flex",
  gap: "8px",
};

const input = {
  flex: 1,
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const sendBtn = {
  padding: "10px 14px",
  borderRadius: "8px",
  background: "black",
  color: "white",
  border: "none",
  cursor: "pointer",
};
