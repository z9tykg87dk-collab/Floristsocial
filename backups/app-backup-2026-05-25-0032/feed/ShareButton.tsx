"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ postId }: { postId: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      window.prompt("Kopiera länken:", url);
    }
  }

  async function sharePost() {
    const url = `${window.location.origin}/feed/post/${postId}`;

    try {
      const canUseNativeShare =
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        /iPhone|iPad|Android/i.test(navigator.userAgent);

      if (canUseNativeShare) {
        await navigator.share({
          title: "FloristSocial inlägg",
          text: "Titta på detta inlägg på FloristSocial",
          url,
        });

        return;
      }

      await copyLink(url);
    } catch {
      await copyLink(url);
    }
  }

  return (
    <button type="button" onClick={sharePost} style={buttonStyle}>
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? "Länk kopierad" : "Dela"}
    </button>
  );
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 44,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  fontSize: 15,
  fontWeight: 800,
  color: "#111827",
  padding: "0 12px",
  borderRadius: 999,
};
