export type ParticipantRole =
  | "senior_florist"
  | "junior_florist"
  | "admin_personnel"
  | "customer";

export type ConversationType =
  | "direct"
  | "group"
  | "referral"
  | "order";

export type ConversationOutcome =
  | "none"
  | "referral_created"
  | "referral_accepted"
  | "referral_declined"
  | "order_created"
  | "completed";

export type ChatParticipant = {
  id: string;
  user_id?: string | null;
  florist_id?: string | null;
  customer_id?: string | null;

  role: ParticipantRole;

  display_name: string;
  florist_name?: string | null;
  avatar_url?: string | null;
  logo_url?: string | null;

  joined_at: string;
  last_read_at?: string | null;
};
export type ChatEconomy =
  | {
      can_view_all: true;
      order_value: number | null;
      seller_commission: number | null;
      executor_commission: number | null;
      platform_commission: number | null;
      payment_fee: number | null;
    }
  | {
      can_view_all: false;
      order_value: number | null;
      own_commission: number | null;
    };
export type ChatListItem = {
  conversation_id: string;
  conversation_type: ConversationType;

  title: string;
  participants: ChatParticipant[];

  last_message: string | null;
  last_message_at: string | null;
  created_at: string;

  unread_count: number;

  outcome: ConversationOutcome;

  referral_id?: string | null;
  order_id?: string | null;

  referral_value?: number | null;
  platform_fee?: number | null;

  economy?: ChatEconomy | null;
};
