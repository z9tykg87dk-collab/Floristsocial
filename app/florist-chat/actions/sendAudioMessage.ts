"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function sendAudioMessage(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const conversationId = String(formData.get("conversation_id") || "");
  const audioFile = formData.get("audio") as File | null;

  console.log("AUDIO ACTION START", {
    conversationId,
    hasAudio: !!audioFile,
    audioSize: audioFile?.size,
    audioType: audioFile?.type,
  });

  if (!conversationId || !audioFile || audioFile.size === 0) {
    return { ok: false, error: "Missing conversationId or audio file" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("AUDIO USER ERROR", userError);
    return { ok: false, error: "No logged in user" };
  }

  const filePath = `${conversationId}/audio-${Date.now()}.webm`;

  const { error: uploadError } = await supabase.storage
    .from("chat-media")
    .upload(filePath, audioFile, {
      contentType: "audio/webm",
      upsert: true,
    });

  if (uploadError) {
    console.error("AUDIO UPLOAD ERROR", uploadError);
    return { ok: false, error: uploadError.message };
  }

  const { data } = supabase.storage.from("chat-media").getPublicUrl(filePath);

  const { error: insertError } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    sender_display_name: "Nick",
    sender_florist_name: "Makalösa Blommor",
    content: "🎙️ Ljudmeddelande",
    message_type: "audio",
    audio_url: data.publicUrl,
  });

  if (insertError) {
    console.error("AUDIO INSERT ERROR", insertError);
    return { ok: false, error: insertError.message };
  }

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath(`/florist-chat/${conversationId}`);
  revalidatePath("/florist-chat");

  return { ok: true };
}
