"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function CommentSection({ postId }: { postId: string }) {
  const supabase = createSupabaseBrowserClient();

  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadComments() {
    const { data } = await supabase
      .from("post_comments")
      .select("id, content, created_at, user_id")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    setComments(data || []);
  }

  useEffect(() => {
    loadComments();

    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_comments",
          filter: `post_id=eq.${postId}`,
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  async function addComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content.trim()) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Du måste vara inloggad för att kommentera.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("post_comments").insert({
      post_id: postId,
      user_id: user.id,
      content: content.trim(),
    });

    setLoading(false);

    if (error) {
      alert("Kunde inte skicka kommentar: " + error.message);
      return;
    }

    setContent("");
    setOpen(true);
  }

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: "999px",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        💬 Kommentera {comments.length > 0 ? `· ${comments.length}` : "· 0"}
      </button>

      {open && (
        <div
          style={{
            marginTop: "1rem",
            padding: "12px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#f9fafb",
          }}
        >
          {comments.length === 0 ? (
            <p style={{ color: "#666" }}>Inga kommentarer ännu.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <p style={{ margin: 0 }}>{comment.content}</p>
                <small style={{ color: "#777" }}>
                  {new Date(comment.created_at).toLocaleString("sv-SE")}
                </small>
              </div>
            ))
          )}

          <form onSubmit={addComment} style={{ marginTop: "1rem" }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={300}
              placeholder="Skriv en kommentar..."
              style={{
                width: "100%",
                minHeight: "80px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />

            <button
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loading ? "Skickar..." : "Skicka kommentar"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
