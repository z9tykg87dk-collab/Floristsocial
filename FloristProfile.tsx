"use client"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { startChat } from "@/lib/chat"

export default function FloristProfile({ florist, myFloristId }) {
  const router = useRouter()

  const handleChat = async () => {
    const convoId = await startChat(
      supabase,
      myFloristId,
      florist.id
    )

    router.push(`/chat/${convoId}`)
  }

  return (
    <div style={{ padding: 20 }}>
      <img
        src={florist.profile_image_url || "/placeholder.png"}
        width={80}
        height={80}
        style={{ borderRadius: "50%" }}
      />

      <h2>
        {florist.shop_name
          ? florist.shop_name
          : `${florist.first_name} ${florist.last_name}`}
      </h2>

      <button onClick={handleChat}>
        Start chat
      </button>
    </div>
  )
}
