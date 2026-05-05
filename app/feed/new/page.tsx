"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Video, UploadCloud, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const TITLE_MAX = 80;
const CAPTION_MAX = 500;
const HASHTAG_MAX = 7;

export default function NewPostPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function hashtagCount() {
    return hashtags.split(" ").filter((tag) => tag.trim().startsWith("#")).length;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !file) {
      alert("Välj fil först");
      setLoading(false);
      return;
    }

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    await supabase.storage.from("post-media").upload(filePath, file);

    const { data } = supabase.storage.from("post-media").getPublicUrl(filePath);

    await supabase.from("posts").insert({
      florist_id: user.id,
      media_type: mediaType,
      title,
      caption,
      hashtags,
      price: price ? Number(price) : null,
      image_url: mediaType === "image" ? data.publicUrl : null,
      video_url: mediaType === "video" ? data.publicUrl : null,
    });

    setLoading(false);
    router.push("/feed");
    router.refresh();
  }

  return (
    <main style={page}>
      <h1 style={titleStyle}>Skapa inlägg</h1>
      <p style={subtitleStyle}>
        Lägg upp en bild eller video med namn, beskrivning och pris.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={card}>
          <label style={label}>Typ av media</label>

          <div style={typeGrid}>
            <button
              type="button"
              onClick={() => setMediaType("image")}
              style={{
                ...typeButton,
                borderColor: mediaType === "image" ? "#16a34a" : "#e5e7eb",
                background: mediaType === "image" ? "#ecfdf5" : "#fff",
              }}
            >
              <ImagePlus size={20} />
              Bild
            </button>

            <button
              type="button"
              onClick={() => setMediaType("video")}
              style={{
                ...typeButton,
                borderColor: mediaType === "video" ? "#16a34a" : "#e5e7eb",
                background: mediaType === "video" ? "#ecfdf5" : "#fff",
              }}
            >
              <Video size={20} />
              Video
            </button>
          </div>
        </div>

        <div style={card}>
          <label style={label}>Ladda upp {mediaType === "image" ? "bild" : "video"}</label>

          <label style={uploadBox}>
            {file ? (
              <CheckCircle2 size={36} color="#16a34a" />
            ) : (
              <UploadCloud size={38} color="#16a34a" />
            )}

            <strong>
              {file ? file.name : "Klicka här för att välja fil"}
            </strong>

            <span style={uploadHint}>
              {mediaType === "image"
                ? "Ladda upp JPG, PNG eller WebP"
                : "Ladda upp MP4, MOV eller WebM"}
            </span>

            <input
              type="file"
              accept={mediaType === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          {preview && (
            <div style={{ marginTop: "1rem" }}>
              {mediaType === "image" ? (
                <img src={preview} alt="" style={previewStyle} />
              ) : (
                <video src={preview} controls style={previewStyle} />
              )}
            </div>
          )}
        </div>

        <div style={card}>
          <label style={label}>Namn</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={TITLE_MAX}
            style={input}
            placeholder="Ex. Sommarbukett"
          />
          <small>{title.length}/{TITLE_MAX}</small>
        </div>

        <div style={card}>
          <label style={label}>Beskrivning</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={CAPTION_MAX}
            style={{ ...input, minHeight: 120 }}
            placeholder="Beskriv inlägget..."
          />
        </div>

        <div style={card}>
          <label style={label}>Hashtags</label>
          <input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            style={input}
            placeholder="#bröllop #bukett #rosor"
          />
          <small>{hashtagCount()}/{HASHTAG_MAX}</small>
        </div>

        <div style={card}>
          <label style={label}>Pris</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ ...input, flex: 1 }}
              placeholder="Ex. 595"
            />
            <span style={{ fontWeight: 700 }}>kr</span>
          </div>
        </div>

        <div style={{ ...card, background: "#f9fafb" }}>
          <strong>Rättigheter</strong>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Du ansvarar för att du har rätt att använda innehållet.
          </p>
        </div>

        <button style={button} disabled={loading}>
          {loading ? "Publicerar..." : "Publicera"}
        </button>
      </form>
    </main>
  );
}

const page: React.CSSProperties = {
  padding: "2rem",
  maxWidth: 680,
  margin: "0 auto",
  minHeight: "100vh",
  background: "#f6f2ea",
};

const titleStyle: React.CSSProperties = {
  marginBottom: 6,
  fontSize: 34,
};

const subtitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 22,
  color: "#6b7280",
};

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: "1rem",
  marginBottom: "1rem",
  background: "#ffffff",
  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
};

const label: React.CSSProperties = {
  display: "block",
  fontWeight: 800,
  marginBottom: 8,
};

const typeGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const typeButton: React.CSSProperties = {
  padding: "12px",
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontWeight: 800,
};

const uploadBox: React.CSSProperties = {
  border: "2px dashed #86efac",
  borderRadius: 18,
  padding: "28px 18px",
  background: "#f0fdf4",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textAlign: "center",
};

const uploadHint: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 11,
  borderRadius: 12,
  border: "1px solid #d1d5db",
  outline: "none",
};

const previewStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 16,
  display: "block",
};

const button: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 14,
  background: "#111827",
  color: "white",
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
};
