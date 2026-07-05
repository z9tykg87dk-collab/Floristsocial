"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
};

function shortUserId(id: string) {
  return `Användare ${id.slice(0, 6)}`;
}

export default function CommentSection({ postId }: { postId: string }) {
  const supabase = createSupabaseBrowserClient();

  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  async function loadComments() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUserId(user?.id || null);

    const { data } = await (supabase as any)
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
        },
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

    const { error } = await (supabase as any).from("post_comments").insert({
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
    loadComments();
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          minHeight: 44,
          borderRadius: 999,
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          color: "#111827",
          cursor: "pointer",
          padding: "0 12px",
          fontSize: 15,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span>💬 Kommentera</span>
        <span>· {comments.length}</span>
      </button>

      {open && (
        <div
          style={{
            gridColumn: "1 / -1",
            marginTop: 8,
            padding: 14,
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            background: "#f9fafb",
          }}
        >
          {comments.length === 0 ? (
            <p style={{ color: "#666", marginTop: 0 }}>
              Inga kommentarer ännu.
            </p>
          ) : (
            comments.map((comment) => {
              const name =
                comment.user_id === currentUserId
                  ? "Du"
                  : shortUserId(comment.user_id);

              return (
                <div
                  key={comment.id}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <strong>{name}</strong>
                  <p style={{ margin: "4px 0" }}>{comment.content}</p>
                  <small style={{ color: "#777" }}>
                    {new Date(comment.created_at).toLocaleString("sv-SE")}
                  </small>
                </div>
              );
            })
          )}

          <form onSubmit={addComment} style={{ marginTop: "1rem" }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={300}
              placeholder="Skriv en kommentar..."
              style={{
                width: "100%",
                minHeight: "90px",
                padding: "10px",
                borderRadius: "12px",
                border: "1px solid #ddd",
              }}
            />

            <button
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "10px 14px",
                borderRadius: "12px",
                background: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              {loading ? "Skickar..." : "Skicka kommentar"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
