"use client"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { startChat } from "@/lib/chat"

export default function FloristProfile({ florist, myFloristId }: any) {
  const router = useRouter()

  if (!florist) {
    return <div style={{ padding: 20 }}>Florist hittades inte.</div>
  }

  const displayName =
    florist.shop_name ||
    `${florist.first_name || ""} ${florist.last_name || ""}`.trim() ||
    florist.email ||
    "Florist"

  const handleChat = async () => {
    try {
      const convoId = await startChat(supabase, myFloristId, florist.id)
      router.push(`/chat/${convoId}`)
    } catch (error) {
      console.error("Start chat error:", error)
      alert("Kunde inte starta chatten")
    }
  }

  return (
    <div style={{ padding: 20 }}>
      {florist.profile_image_url && (
        <img
          src={florist.profile_image_url}
          width={80}
          height={80}
          style={{ borderRadius: "50%" }}
          alt={displayName}
        />
      )}

      <h2>{displayName}</h2>

      <button onClick={handleChat}>Start chat</button>
    </div>
  )
}
