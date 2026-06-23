"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const TITLE_MAX = 80;
const CAPTION_MAX = 500;
const HASHTAG_MAX = 7;
const PRICE_MAX = 50000;

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const postId = params.id;

  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [price, setPrice] = useState("");

  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function hashtagCount() {
    return hashtags.split(" ").filter((tag) => tag.trim().startsWith("#"))
      .length;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const isImage = selected.type.startsWith("image/");
    const isVideo = selected.type.startsWith("video/");

    if (mediaType === "image" && !isImage) {
      alert("Välj en bildfil.");
      return;
    }

    if (mediaType === "video" && !isVideo) {
      alert("Välj en videofil.");
      return;
    }

    if (isImage && selected.size > 5 * 1024 * 1024) {
      alert("Bild får vara max 5 MB.");
      return;
    }

    if (isVideo && selected.size > 50 * 1024 * 1024) {
      alert("Video får vara max 50 MB.");
      return;
    }

    setNewFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function validateForm() {
    if (title.length > TITLE_MAX) {
      alert(`Namn får vara max ${TITLE_MAX} tecken.`);
      return false;
    }

    if (caption.length > CAPTION_MAX) {
      alert(`Beskrivning får vara max ${CAPTION_MAX} tecken.`);
      return false;
    }

    if (hashtagCount() > HASHTAG_MAX) {
      alert(`Du kan använda max ${HASHTAG_MAX} hashtags.`);
      return false;
    }

    if (price && Number(price) > PRICE_MAX) {
      alert(`Pris får vara max ${PRICE_MAX} kr.`);
      return false;
    }

    return true;
  }

  useEffect(() => {
    loadPost();
  }, []);

  async function loadPost() {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, media_type, title, caption, hashtags, price, image_url, video_url, florist_id",
      )
      .eq("id", postId)
      .single();

    if (error || !data) {
      alert("Kunde inte ladda inlägget");
      router.push("/feed");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || data.florist_id !== user.id) {
      alert("Du kan bara ändra dina egna inlägg");
      router.push("/feed");
      return;
    }

    setMediaType((data.media_type as "image" | "video") || "image");
    setTitle(data.title || "");
    setCaption(data.caption || "");
    setHashtags(data.hashtags || "");
    setPrice(data.price ? String(data.price) : "");
    setCurrentImageUrl(data.image_url || "");
    setCurrentVideoUrl(data.video_url || "");
    setLoading(false);
  }

  async function uploadNewFileIfNeeded(userId: string) {
    if (!newFile) {
      return {
        imageUrl: currentImageUrl,
        videoUrl: currentVideoUrl,
      };
    }

    const safeFileName = newFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filePath = `${userId}/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("post-media")
      .upload(filePath, newFile);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from("post-media").getPublicUrl(filePath);

    return {
      imageUrl: mediaType === "image" ? data.publicUrl : "",
      videoUrl: mediaType === "video" ? data.publicUrl : "",
    };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      alert("Du är inte inloggad.");
      return;
    }

    try {
      const uploaded = await uploadNewFileIfNeeded(user.id);

      const { error } = await supabase
        .from("posts")
        .update({
          media_type: mediaType,
          title,
          caption,
          hashtags,
          price: price ? Number(price) : null,
          image_url: mediaType === "image" ? uploaded.imageUrl : null,
          video_url: mediaType === "video" ? uploaded.videoUrl : null,
        })
        .eq("id", postId);

      setSaving(false);

      if (error) {
        alert("Kunde inte spara: " + error.message);
        return;
      }

      router.push("/feed");
      router.refresh();
    } catch (err) {
      setSaving(false);
      alert("Kunde inte ladda upp filen: " + (err as Error).message);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: "2rem", maxWidth: "640px", margin: "0 auto" }}>
        Laddar inlägg...
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "640px", margin: "0 auto" }}>
      <h1>Ändra inlägg</h1>

      <form onSubmit={handleSubmit}>
        <div style={card}>
          <label style={label}>Typ av media</label>
          <select
            value={mediaType}
            onChange={(e) => {
              setMediaType(e.target.value as "image" | "video");
              setNewFile(null);
              setPreview(null);
            }}
            style={input}
          >
            <option value="image">Bild</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div style={card}>
          <label style={label}>
            Välj ny {mediaType === "image" ? "bild" : "video"}
          </label>

          <input
            type="file"
            accept={mediaType === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
          />

          <p style={helpText}>Lämna tomt om du vill behålla nuvarande media.</p>
        </div>

        <div style={card}>
          <label style={label}>Förhandsvisning</label>

          {preview ? (
            mediaType === "image" ? (
              <img src={preview} alt="Ny preview" style={previewStyle} />
            ) : (
              <video src={preview} controls style={previewStyle} />
            )
          ) : mediaType === "image" && currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="Nuvarande bild"
              style={previewStyle}
            />
          ) : mediaType === "video" && currentVideoUrl ? (
            <video src={currentVideoUrl} controls style={previewStyle} />
          ) : (
            <p style={helpText}>Ingen media vald.</p>
          )}
        </div>

        <div style={card}>
          <label style={label}>Namn</label>
          <input
            type="text"
            maxLength={TITLE_MAX}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={input}
          />
          <small>
            {title.length}/{TITLE_MAX} tecken
          </small>
        </div>

        <div style={card}>
          <label style={label}>Beskrivning</label>
          <textarea
            maxLength={CAPTION_MAX}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ ...input, minHeight: "120px" }}
          />
          <small>
            {caption.length}/{CAPTION_MAX} tecken. Rekommenderat max 7 rader.
          </small>
        </div>

        <div style={card}>
          <label style={label}>Hashtags</label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            style={input}
          />
          <small>
            {hashtagCount()}/{HASHTAG_MAX} hashtags
          </small>
        </div>

        <div style={card}>
          <label style={label}>Pris</label>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="number"
              min="0"
              max={PRICE_MAX}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ ...input, flex: 1 }}
              placeholder="Ex. 595"
            />
            <span style={{ fontWeight: "600" }}>kr</span>
          </div>

          <small>Max {PRICE_MAX} kr i V1.</small>
        </div>

        <div style={{ ...card, background: "#f9fafb" }}>
          <strong>Rättigheter och ansvar</strong>
          <p style={{ marginBottom: 0 }}>
            Du ansvarar för att du har rätt att använda bild, video, musik, text
            och produktinformation.
          </p>
        </div>

        <button style={button} disabled={saving}>
          {saving ? "Sparar..." : "Spara ändringar"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        <a href="/feed">Avbryt och gå tillbaka</a>
      </p>
    </main>
  );
}

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "1rem",
  marginBottom: "1rem",
  background: "#ffffff",
};

const label = {
  display: "block",
  fontWeight: "600",
  marginBottom: "6px",
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const helpText = {
  fontSize: "13px",
  color: "#666",
  marginBottom: 0,
};

const previewStyle = {
  width: "100%",
  maxHeight: "360px",
  objectFit: "cover" as const,
  borderRadius: "12px",
};

const button = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  background: "black",
  color: "white",
  border: "none",
  fontWeight: "600",
  cursor: "pointer",
};
