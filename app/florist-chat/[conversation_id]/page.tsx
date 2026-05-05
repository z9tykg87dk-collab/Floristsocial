import { Icons } from "@/components/icons";
import Link from "next/link";
import type React from "react";
import { ArrowLeft, Camera, Paperclip, Phone, Video, Send } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendMessage } from "../actions/sendMessage";
import VoiceRecorder from "@/components/VoiceRecorder";

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ conversation_id: string }>;
}) {
  const { conversation_id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: participants } = await supabase
    .from("conversation_participants")
    .select("display_name, florist_name, logo_url")
    .eq("conversation_id", conversation_id);

  const other = participants?.find((p) => p.display_name !== "Nick");

  const { data: messages } = await supabase
    .from("messages")
    .select(
      "id, sender_id, sender_display_name, sender_florist_name, content, created_at, read_at, message_type, audio_url"
    )
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true });

  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <Link href="/florist-chat" style={backButtonStyle}>
          <ArrowLeft size={22} />
        </Link>

        <div style={profileStyle}>
          <div style={avatarStyle}>
            {other?.logo_url && (
              <img src={other.logo_url} alt="" style={avatarImageStyle} />
            )}
          </div>

          <div>
            <div style={nameStyle}>{other?.florist_name || "Florist"}</div>
            <div style={subNameStyle}>{other?.display_name || ""}</div>
          </div>
        </div>

        <div style={headerActionsStyle}>
          <button type="button" style={iconButtonStyle}>
            <Phone size={18} />
          </button>
          <button type="button" style={iconButtonStyle}>
            <Video size={18} />
          </button>
        </div>
      </header>

      <section style={messagesStyle}>
        {(messages ?? []).map((msg) => {
          const isMine =
            msg.sender_id === user?.id || msg.sender_display_name === "Nick";

          const audioSrc = msg.audio_url || msg.content;

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  ...bubbleStyle,
                  background: isMine ? "#dcfce7" : "#ffffff",
                  borderTopRightRadius: isMine ? 4 : 18,
                  borderTopLeftRadius: isMine ? 18 : 4,
                }}
              >
                <div style={senderStyle}>{msg.sender_display_name}</div>

                <div style={{ marginTop: 6 }}>
                  {msg.message_type === "audio" && audioSrc ? (
                    <audio
                      controls
                      preload="auto"
                      src={audioSrc}
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>

                <div style={timeStyle}>
                  {new Date(msg.created_at).toLocaleString("sv-SE")}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <footer style={footerStyle}>
        <form action={sendMessage} style={formStyle}>
          <input type="hidden" name="conversation_id" value={conversation_id} />

          <button type="button" style={iconButtonStyle}>
            <Paperclip size={18} />
          </button>

          <button type="button" style={iconButtonStyle}>
            <Camera size={18} />
          </button>

          <VoiceRecorder conversationId={conversation_id} />

          <input
            name="content"
            placeholder="Skriv meddelande..."
            style={inputStyle}
          />

          <button type="submit" style={sendButtonStyle}>
            <Send size={18} />
          </button>
        </form>
      </footer>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f6f2ea",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  height: 72,
  padding: "0 18px",
  background: "rgba(255,255,255,0.92)",
  borderBottom: "1px solid #e5e7eb",
  display: "grid",
  gridTemplateColumns: "48px 1fr 96px",
  alignItems: "center",
  gap: 12,
  position: "sticky",
  top: 0,
  zIndex: 20,
  backdropFilter: "blur(10px)",
};

const backButtonStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  color: "#111827",
  textDecoration: "none",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
};

const profileStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const avatarStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "#e5e7eb",
  overflow: "hidden",
};

const avatarImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const nameStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "#111827",
};

const subNameStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
};

const headerActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
};

const messagesStyle: React.CSSProperties = {
  flex: 1,
  padding: "16px",
  paddingBottom: 100,
};

const bubbleStyle: React.CSSProperties = {
  maxWidth: "75%",
  padding: "10px 12px",
  borderRadius: 18,
  border: "1px solid #e5e7eb",
  wordBreak: "break-word",
  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
};

const senderStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#374151",
};

const timeStyle: React.CSSProperties = {
  fontSize: 10,
  marginTop: 6,
  color: "#6b7280",
};

const footerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  padding: 10,
  background: "rgba(246,242,234,0.9)",
  borderTop: "1px solid #ddd",
  backdropFilter: "blur(10px)",
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "40px 40px 40px 1fr 44px",
  gap: 8,
  alignItems: "center",
  maxWidth: 900,
  margin: "0 auto",
};

const iconButtonStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#111827",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const inputStyle: React.CSSProperties = {
  padding: "11px 14px",
  borderRadius: 999,
  border: "1px solid #d1d5db",
  outline: "none",
  background: "#fff",
};

const sendButtonStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  boxShadow: "0 6px 16px rgba(22,163,74,0.28)",
};
