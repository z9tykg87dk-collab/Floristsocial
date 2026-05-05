"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function sendMessage(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const conversationId = String(formData.get("conversation_id") || "");
  const content = String(formData.get("content") || "").trim();

  if (!conversationId || !content) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    sender_display_name: "Nick",
    sender_florist_name: "Makalösa Blommor",
    content,
  });

  if (error) {
    console.error("sendMessage error:", error);
    return;
  }

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath(`/florist-chat/${conversationId}`);
  revalidatePath("/florist-chat");
}
