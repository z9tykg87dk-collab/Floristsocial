"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const TITLE_MAX = 80;
const CAPTION_MAX = 500;
const HASHTAG_MAX = 7;
const PRICE_MAX = 50000;

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
    <main style={{ padding: "2rem", maxWidth: "640px", margin: "0 auto" }}>
      <h1>Skapa inlägg</h1>

      <form onSubmit={handleSubmit}>

        {/* MEDIA TYPE */}
        <div style={card}>
          <label style={label}>Typ av media</label>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as "image" | "video")}
            style={input}
          >
            <option value="image">Bild</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* UPLOAD */}
        <div style={card}>
          <label style={label}>Ladda upp {mediaType}</label>

          <input
            type="file"
            accept={mediaType === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
          />

          {preview && (
            <div style={{ marginTop: "1rem" }}>
              {mediaType === "image" ? (
                <img src={preview} style={previewStyle} />
              ) : (
                <video src={preview} controls style={previewStyle} />
              )}
            </div>
          )}
        </div>

        {/* TITLE */}
        <div style={card}>
          <label style={label}>Namn</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={TITLE_MAX}
            style={input}
          />
          <small>{title.length}/{TITLE_MAX}</small>
        </div>

        {/* CAPTION */}
        <div style={card}>
          <label style={label}>Beskrivning</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={CAPTION_MAX}
            style={{ ...input, minHeight: "120px" }}
          />
        </div>

        {/* HASHTAGS */}
        <div style={card}>
          <label style={label}>Hashtags</label>
          <input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            style={input}
          />
          <small>{hashtagCount()}/{HASHTAG_MAX}</small>
        </div>

        {/* PRICE WITH CURRENCY */}
        <div style={card}>
          <label style={label}>Pris</label>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ ...input, flex: 1 }}
              placeholder="Ex. 595"
            />
            <span style={{ fontWeight: "600" }}>kr</span>
          </div>
        </div>

        {/* TERMS */}
        <div style={{ ...card, background: "#f9fafb" }}>
          <strong>Rättigheter</strong>
          <p style={{ margin: 0 }}>
            Du ansvarar för att du har rätt att använda innehållet.
          </p>
        </div>

        <button style={button} disabled={loading}>
          {loading ? "Laddar..." : "Publicera"}
        </button>

      </form>
    </main>
  );
}

/* STYLES */

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

const previewStyle = {
  width: "100%",
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
