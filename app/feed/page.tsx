import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import FollowButton from "./FollowButton";
import PostMoreMenu from "./PostMoreMenu";
import LikeButton from "./LikeButton";
import PostOwnerActions from "./PostOwnerActions";
import CommentSection from "./CommentSection";

export default async function FeedPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      caption,
      hashtags,
      price,
      image_url,
      video_url,
      media_type,
      created_at,
      florist_id
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Kunde inte ladda feed</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "720px", margin: "0 auto" }}>
      <h1>Florist Feed</h1>

      <p style={{ marginTop: "0.5rem" }}>
       <a href="/florist-chat">💬 Florist-chat</a>
      </p>

      <p style={{ color: "#555" }}>
        Här kan florister dela bilder, video och produkter.
      </p>

      <p style={{ marginTop: "1rem" }}>
        <a href="/feed/new">+ Skapa inlägg</a>
      </p>

      <hr style={{ margin: "2rem 0" }} />

      {!posts || posts.length === 0 ? (
        <p>Inga inlägg ännu.</p>
      ) : (
        posts.map((post) => (
          <article key={post.id} style={postCard}>

            {/* HEADER */}
            <div style={header}>
              <div>
                <strong>Florist</strong>
                <div style={timeText}>
                  {new Date(post.created_at).toLocaleString("sv-SE")}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <FollowButton floristId={post.florist_id} />
                <PostMoreMenu />
              </div>
            </div>

            {/* MEDIA */}
            <div style={mediaBox}>
              {post.media_type === "video" && post.video_url ? (
                <video src={post.video_url} controls style={media} />
              ) : (
                post.image_url && <img src={post.image_url} style={media} />
              )}
            </div>

            {/* CONTENT */}
            <div style={contentBox}>
              {post.title && <h2 style={{ marginBottom: "0.5rem" }}>{post.title}</h2>}

              {post.caption && <p style={{ marginBottom: "0.5rem" }}>{post.caption}</p>}

              {post.hashtags && (
                <p style={{ color: "#777", marginBottom: "0.5rem" }}>
                  {post.hashtags}
                </p>
              )}

              {post.price && (
                <p style={priceText}>{post.price} kr</p>
              )}
            </div>

            {/* OWNER ACTIONS */}
            {post.florist_id === user.id && (
              <div style={ownerBox}>
                <PostOwnerActions postId={post.id} />
              </div>
            )}

            {/* ACTION BAR */}
            <div style={actionBar}>
              <LikeButton postId={post.id} />
              <CommentSection postId={post.id} />
              <span>↗️ Dela</span>
            </div>

            {/* CTA */}
            <a href={`/feed/post/${post.id}`} style={cta}>
              Beställ / Visa mer
            </a>

          </article>
        ))
      )}
    </main>
  );
}

/* STYLES */

const postCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "1rem",
  marginBottom: "1.5rem",
  background: "#ffffff",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

const timeText = {
  fontSize: "13px",
  color: "#666",
};

const mediaBox = {
  borderRadius: "12px",
  overflow: "hidden",
  background: "#f3f4f6",
  marginBottom: "1rem",
};

const media = {
  width: "100%",
  maxHeight: "420px",
  objectFit: "cover" as const,
};

const contentBox = {
  background: "#f9fafb",
  padding: "12px",
  borderRadius: "12px",
  marginBottom: "1rem",
};

const priceText = {
  fontWeight: "bold",
  fontSize: "18px",
};

const ownerBox = {
  background: "#f3f4f6",
  padding: "10px",
  borderRadius: "10px",
  marginBottom: "1rem",
};

const actionBar = {
  display: "flex",
  gap: "12px",
  marginBottom: "1rem",
  fontSize: "14px",
  alignItems: "center",
};

const cta = {
  display: "block",
  textAlign: "center" as const,
  padding: "12px",
  borderRadius: "10px",
  background: "black",
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
};
