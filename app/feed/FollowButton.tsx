"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function FollowButton({ floristId }: { floristId: string }) {
  const supabase = createSupabaseBrowserClient();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFollow();
  }, []);

  async function checkFollow() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", user.id)
      .eq("following_id", floristId)
      .maybeSingle();

    setFollowing(!!data);
    setLoading(false);
  }

  async function toggleFollow() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (following) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", floristId);

      setFollowing(false);
    } else {
      await supabase.from("follows").insert({
        follower_id: user.id,
        following_id: floristId,
      });

      setFollowing(true);
    }

    setLoading(false);
  }

  if (loading) return <button>Laddar...</button>;

  return (
    <button
      onClick={toggleFollow}
      style={{
        marginTop: "10px",
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: following ? "#eee" : "white",
        cursor: "pointer",
      }}
    >
      {following ? "Följer" : "Följ florist"}
    </button>
  );
}
