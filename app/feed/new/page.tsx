"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ImagePlus,
  Video,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Save,
} from "lucide-react";
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
  const [mediaSaved, setMediaSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function hashtagCount() {
    return hashtags.split(" ").filter((tag) => tag.trim().startsWith("#"))
      .length;
  }

  function handleSelectedFile(selected: File | null) {
    if (!selected) return;

    const fileName = selected.name.toLowerCase();

    const isHeicOrHeif =
      fileName.endsWith(".heic") ||
      fileName.endsWith(".heif") ||
      selected.type === "image/heic" ||
      selected.type === "image/heif";

    const isImage = selected.type.startsWith("image/") || isHeicOrHeif;

    const isVideo = selected.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Välj en bild eller video.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setMediaType(isVideo ? "video" : "image");
    setMediaSaved(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleSelectedFile(e.target.files?.[0] || null);
  }

  function removeMedia() {
    if (preview) URL.revokeObjectURL(preview);

    setFile(null);
    setPreview(null);
    setMediaSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Välj bild eller video först.");
      return;
    }

    if (!mediaSaved) {
      alert("Klicka på Spara media innan du publicerar.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Du måste vara inloggad.");
      setLoading(false);
      return;
    }

    const safeFileName = file.name.replaceAll(" ", "-").toLowerCase();

    const filePath = `${user.id}/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("post-media")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);

      alert(`Kunde inte ladda upp media: ${uploadError.message}`);

      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("post-media").getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("posts").insert({
      florist_id: user.id,
      media_type: mediaType,
      title,
      caption,
      hashtags,
      price: price ? Number(price) : null,
      image_url: mediaType === "image" ? data.publicUrl : null,
      video_url: mediaType === "video" ? data.publicUrl : null,
    });

    if (insertError) {
      alert("Kunde inte publicera inlägget.");
      setLoading(false);
      return;
    }

    setLoading(false);

    router.push("/feed");
    router.refresh();
  }

  return (
    <main style={page}>
      <h1 style={titleStyle}>Skapa inlägg</h1>

      <p style={subtitleStyle}>
        Lägg upp bild eller video med namn, pris, beskrivning och hashtags.
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
          <label style={label}>Ladda upp media</label>

          <div
            style={uploadBox}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();

              handleSelectedFile(event.dataTransfer.files?.[0] || null);
            }}
          >
            <label style={uploadInner}>
              {file ? (
                <CheckCircle2 size={38} color="#16a34a" />
              ) : (
                <UploadCloud size={40} color="#16a34a" />
              )}

              <strong>
                {file ? file.name : "Klicka eller dra in bild/video här"}
              </strong>

              <span style={uploadHint}>
                JPG, PNG, WebP, HEIC, HEIF, MP4, MOV eller WebM
              </span>

              <input
                type="file"
                accept="image/*,video/*,.heic,.heif"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {preview && (
            <div style={previewWrap}>
              {mediaType === "image" ? (
                <img src={preview} alt="" style={previewStyle} />
              ) : (
                <video src={preview} controls style={previewStyle} />
              )}

              <div style={mediaActions}>
                <span style={mediaSaved ? savedBadge : unsavedBadge}>
                  {mediaSaved ? "Sparad" : "Ej sparad"}
                </span>

                <button
                  type="button"
                  onClick={() => setMediaSaved(true)}
                  style={saveMediaButton}
                >
                  <Save size={16} />
                  Spara media
                </button>

                <button
                  type="button"
                  onClick={removeMedia}
                  style={removeButton}
                >
                  <Trash2 size={16} />
                  Ta bort
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={card}>
          <label style={label}>Namn / titel</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={TITLE_MAX}
            style={input}
            placeholder="Ex. Sommarbukett"
          />

          <small>
            {title.length}/{TITLE_MAX}
          </small>
        </div>

        <div style={card}>
          <label style={label}>Pris</label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                ...input,
                flex: 1,
              }}
              placeholder="Ex. 595"
            />

            <span style={{ fontWeight: 700 }}>kr</span>
          </div>
        </div>

        <div style={card}>
          <label style={label}>Beskrivning</label>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={CAPTION_MAX}
            style={{
              ...input,
              minHeight: 120,
            }}
            placeholder="Beskriv buketten, blommorna, storlek, färg eller stil..."
          />

          <small>
            {caption.length}/{CAPTION_MAX}
          </small>
        </div>

        <div style={card}>
          <label style={label}>Hashtags</label>

          <input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            style={input}
            placeholder="#Bukett #Rosor #Bröllop"
          />

          <small>
            {hashtagCount()}/{HASHTAG_MAX}
          </small>
        </div>

        <div
          style={{
            ...card,
            background: "#f9fafb",
          }}
        >
          <strong>Rättigheter</strong>

          <p
            style={{
              margin: 0,
              color: "#4b5563",
            }}
          >
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
  maxWidth: 760,
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
  padding: 12,
  background: "#f0fdf4",
};

const uploadInner: React.CSSProperties = {
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textAlign: "center",
  padding: "28px 18px",
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

const previewWrap: React.CSSProperties = {
  marginTop: "1rem",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  background: "#fff",
};

const previewStyle: React.CSSProperties = {
  width: "100%",
  maxHeight: 520,
  objectFit: "cover",
  display: "block",
};

const mediaActions: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 10,
  padding: 12,
};

const savedBadge: React.CSSProperties = {
  borderRadius: 999,
  background: "#dcfce7",
  color: "#15803d",
  padding: "7px 12px",
  fontSize: 13,
  fontWeight: 800,
};

const unsavedBadge: React.CSSProperties = {
  borderRadius: 999,
  background: "#fef3c7",
  color: "#92400e",
  padding: "7px 12px",
  fontSize: 13,
  fontWeight: 800,
};

const saveMediaButton: React.CSSProperties = {
  border: "none",
  borderRadius: 12,
  background: "#16a34a",
  color: "#fff",
  padding: "9px 12px",
  fontWeight: 800,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const removeButton: React.CSSProperties = {
  border: "1px solid #fecaca",
  borderRadius: 12,
  background: "#fff",
  color: "#dc2626",
  padding: "9px 12px",
  fontWeight: 800,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
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
