import { SupabaseClient } from "@supabase/supabase-js";
import type { ChatListItem } from "@/types/chat";

export async function getFloristChatList(
  supabase: SupabaseClient,
  userId: string,
  viewerRole: "florist" | "admin" | "super_admin" = "florist",
  viewerFloristId: string | null = null
): Promise<ChatListItem[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      type,
      title,
      outcome,
      created_at,
      last_message_at,
      conversation_participants (
        id,
        florist_id,
        role,
        display_name,
        florist_name,
        avatar_url,
        logo_url,
        joined_at,
        last_read_at
      )
    `)
    .order("last_message_at", { ascending: false });

  if (error) {
    console.error("getFloristChatList error:", error);
    return [];
  }

  return (data ?? []).map((conversation: any) => ({
    conversation_id: conversation.id,
    conversation_type: conversation.type ?? "direct",
    title: conversation.title ?? "Konversation",
    participants: conversation.conversation_participants ?? [],

    last_message: null,
    last_message_at: conversation.last_message_at,
    created_at: conversation.created_at,

    unread_count: 0,

    outcome: conversation.outcome ?? "none",

    referral_id: null,
    order_id: null,

    referral_value: null,
    platform_fee: null,

    economy: null,
  }));
}
