"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Like = {
  user_id: string;
};

function shortUserId(id: string) {
  return `Användare ${id.slice(0, 6)}`;
}

export default function LikeButton({ postId }: { postId: string }) {
  const supabase = createSupabaseBrowserClient();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadLikes();
  }, []);

  async function loadLikes() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUserId(user?.id || null);

    const { data } = await supabase
      .from("post_likes")
      .select("user_id")
      .eq("post_id", postId);

    const allLikes = data || [];
    setLikes(allLikes);

    if (user) {
      setLiked(allLikes.some((like) => like.user_id === user.id));
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
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });
    }

    await loadLikes();
    setLoading(false);
  }

  const likerNames = likes
    .map((like) =>
      like.user_id === currentUserId ? "Du" : shortUserId(like.user_id),
    )
    .join(", ");

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      title={likerNames ? `Gillas av: ${likerNames}` : "Inga likes ännu"}
      style={{
        minHeight: 44,
        borderRadius: 999,
        background: liked ? "#fff1f2" : "#f9fafb",
        border: "1px solid #e5e7eb",
        color: liked ? "#e11d48" : "#111827",
        cursor: loading ? "not-allowed" : "pointer",
        padding: "0 12px",
        fontSize: 15,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <span>{liked ? "❤️ Gillad" : "🤍 Gilla"}</span>
      <span>· {likes.length}</span>
    </button>
  );
}
