import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageCircle, Plus, Radio, Bookmark } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import FollowButton from "./FollowButton";
import PostMoreMenu from "./PostMoreMenu";
import LikeButton from "./LikeButton";
import PostOwnerActions from "./PostOwnerActions";
import CommentSection from "./CommentSection";
import ShareButton from "./ShareButton";

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
    <main style={page}>
      <section style={hero}>
        <div>
          <div style={eyebrow}>FloristSocial</div>
          <h1 style={title}>Florist Feed</h1>
          <p style={subtitle}>
            Dela buketter, inspiration, video och produkter med andra florister.
          </p>

          <div style={heroActions}>
            <Link href="/florist-chat" style={secondaryButton}>
              <MessageCircle size={18} />
              Florist-chat
            </Link>

            <Link href="/feed/new" style={primaryButton}>
              <Plus size={18} />
              Skapa inlägg
            </Link>
          </div>
        </div>

        <div style={liveBox}>
          <button type="button" style={liveButton}>
            <Radio size={18} />
            Live Streaming
          </button>

          <button type="button" style={saveStreamButton}>
            <Bookmark size={16} />
            Spara önskad streaming
          </button>

          <p style={liveText}>Kommer snart</p>
        </div>
      </section>

      {!posts || posts.length === 0 ? (
        <p style={emptyText}>Inga inlägg ännu.</p>
      ) : (
        posts.map((post) => (
          <article key={post.id} style={postCard}>
            <div style={header}>
              <div>
                <strong>Florist</strong>
                <div style={timeText}>
                  {new Date(post.created_at).toLocaleString("sv-SE")}
                </div>
              </div>

              <div style={headerRight}>
                <FollowButton floristId={post.florist_id} />
                <PostMoreMenu />
              </div>
            </div>

            <div style={mediaBox}>
              {post.media_type === "video" && post.video_url ? (
                <video src={post.video_url} controls style={media} />
              ) : (
                post.image_url && <img src={post.image_url} alt="" style={media} />
              )}
            </div>

            <div style={contentBox}>
              {post.title && <h2 style={postTitle}>{post.title}</h2>}

              {post.caption && <p style={caption}>{post.caption}</p>}

              {post.hashtags && <p style={hashtags}>{post.hashtags}</p>}

              {post.price && <p style={priceText}>{post.price} kr</p>}
            </div>

            {post.florist_id === user.id && (
              <div style={ownerBox}>
                <PostOwnerActions postId={post.id} />
              </div>
            )}

            <div style={actionBar}>
              <div style={actionItem}>
                <LikeButton postId={post.id} />
              </div>

              <div style={actionItem}>
                <CommentSection postId={post.id} />
              </div>

              <div style={actionItem}>
                <ShareButton postId={post.id} />
              </div>
            </div>

            <Link href={`/feed/post/${post.id}`} style={cta}>
              Beställ / Visa mer
            </Link>
          </article>
        ))
      )}
    </main>
  );
}

const page: React.CSSProperties = {
  padding: "2rem",
  maxWidth: 760,
  margin: "0 auto",
  background: "#f6f2ea",
  minHeight: "100vh",
};

const hero: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 20,
  alignItems: "stretch",
  padding: 22,
  borderRadius: 24,
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(236,253,245,0.96))",
  border: "1px solid #e5e7eb",
  boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
  marginBottom: 28,
};

const eyebrow: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: "#16a34a",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const title: React.CSSProperties = {
  margin: "6px 0 6px",
  fontSize: 36,
  lineHeight: 1,
  color: "#111827",
};

const subtitle: React.CSSProperties = {
  margin: 0,
  color: "#4b5563",
  fontSize: 15,
  maxWidth: 480,
};

const heroActions: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 18,
};

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "11px 15px",
  borderRadius: 999,
  background: "#16a34a",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 800,
  boxShadow: "0 8px 18px rgba(22,163,74,0.24)",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "11px 15px",
  borderRadius: 999,
  background: "#fff",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 800,
  border: "1px solid #e5e7eb",
};

const liveBox: React.CSSProperties = {
  minWidth: 190,
  padding: 14,
  borderRadius: 18,
  background: "#111827",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  justifyContent: "center",
};

const liveButton: React.CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "10px 12px",
  background: "#ef4444",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const saveStreamButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 999,
  padding: "9px 10px",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
};

const liveText: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: "#d1d5db",
  textAlign: "center",
};

const emptyText: React.CSSProperties = {
  color: "#6b7280",
};

const postCard: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 22,
  padding: "1rem",
  marginBottom: "1.5rem",
  background: "#ffffff",
  boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

const headerRight: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
};

const timeText: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
};

const mediaBox: React.CSSProperties = {
  borderRadius: 16,
  overflow: "hidden",
  background: "#f3f4f6",
  marginBottom: "1rem",
};

const media: React.CSSProperties = {
  width: "100%",
  maxHeight: 420,
  objectFit: "cover",
  display: "block",
};

const contentBox: React.CSSProperties = {
  background: "#f9fafb",
  padding: 14,
  borderRadius: 16,
  marginBottom: "1rem",
};

const postTitle: React.CSSProperties = {
  margin: "0 0 0.5rem",
  fontSize: 22,
};

const caption: React.CSSProperties = {
  margin: "0 0 0.5rem",
  color: "#374151",
};

const hashtags: React.CSSProperties = {
  color: "#6b7280",
  margin: "0 0 0.5rem",
};

const priceText: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 18,
  margin: 0,
};

const ownerBox: React.CSSProperties = {
  background: "#f3f4f6",
  padding: 10,
  borderRadius: 12,
  marginBottom: "1rem",
};

const actionBar: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 8,
  marginBottom: "1rem",
  alignItems: "center",
};

const actionItem: React.CSSProperties = {
  minHeight: 40,
  borderRadius: 999,
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cta: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  padding: 13,
  borderRadius: 14,
  background: "#111827",
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
};
