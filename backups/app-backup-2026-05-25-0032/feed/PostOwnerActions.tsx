"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function PostOwnerActions({
  postId,
}: {
  postId: string;
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function deletePost() {
    const confirmed = confirm("Är du säker på att du vill ta bort inlägget?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      alert("Kunde inte ta bort inlägget: " + error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
      <a
        href={`/feed/post/${postId}/edit`}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          textDecoration: "none",
          color: "black",
          fontSize: "14px",
        }}
      >
        Ändra
      </a>

      <button
        onClick={deletePost}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid crimson",
          background: "white",
          color: "crimson",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Ta bort
      </button>
    </div>
  );
}
