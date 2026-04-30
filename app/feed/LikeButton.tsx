"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LikeButton({ postId }: { postId: string }) {
  const supabase = createSupabaseBrowserClient();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikes();
  }, []);

  async function loadLikes() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { count } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    setLikeCount(count || 0);

    if (user) {
      const { data } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      setLiked(!!data);
    }

    setLoading(false);
  }

  async function toggleLike() {
    if (loading) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      alert("Du måste vara inloggad för att gilla.");
      return;
    }

    if (liked) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (!error) {
        setLiked(false);
        setLikeCount((count) => Math.max(0, count - 1));
      }
    } else {
      const { error } = await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });

      if (!error) {
        setLiked(true);
        setLikeCount((count) => count + 1);
      }
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      style={{
        border: "1px solid #e5e7eb",
        background: liked ? "#fff1f2" : "#ffffff",
        color: liked ? "#e11d48" : "#111827",
        cursor: "pointer",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      {liked ? "❤️ Gillad" : "🤍 Gilla"} · {likeCount}
    </button>
  );
}
