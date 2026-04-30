import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FeedPostPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, caption, hashtags, price, image_url, created_at, florist_id, is_sponsored")
    .eq("id", id)
    .single();

  if (error || !post) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Inlägget kunde inte hittas</h1>
        <p>
          <a href="/feed">Tillbaka till feed</a>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "720px" }}>
      <p>
        <a href="/feed">← Tillbaka till feed</a>
      </p>

      {post.is_sponsored && (
        <p style={{ color: "#666", fontSize: "14px" }}>Sponsrad</p>
      )}

      <h1>{post.title || "Florist-inlägg"}</h1>

      {post.image_url && (
        <img
          src={post.image_url}
          alt=""
          style={{
            width: "100%",
            maxHeight: "420px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "1rem",
          }}
        />
      )}

      <p>{post.caption}</p>

      {post.hashtags && <p style={{ color: "#888" }}>{post.hashtags}</p>}

      {post.price && (
        <p style={{ fontWeight: "bold", fontSize: "20px" }}>{post.price} kr</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Beställningsintresse</h2>
      <p>
        Detta är V1. Nästa steg blir att koppla denna post till riktig produkt,
        checkout och floristens orderflöde.
      </p>

      <button
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "none",
          background: "black",
          color: "white",
          cursor: "pointer",
        }}
      >
        Jag är intresserad
      </button>

      <p style={{ marginTop: "1rem", color: "#666" }}>
        Kommande: Beställ, Besök floristprofil, Meddelande florist.
      </p>
    </main>
  );
}
