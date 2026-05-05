"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({ postId }: { postId: string }) {
  async function sharePost() {
    const url = `${window.location.origin}/feed/post/${postId}`;

    if (navigator.share) {
      await navigator.share({
        title: "FloristSocial inlägg",
        url,
      });
      return;
    }

    await navigator.clipboard.writeText(url);
    alert("Länk kopierad!");
  }

  return (
    <button type="button" onClick={sharePost} style={buttonStyle}>
      <Share2 size={16} />
      Dela
    </button>
  );
}

const buttonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  fontSize: 14,
  color: "#374151",
  padding: "8px 10px",
  borderRadius: 999,
};
