export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Enums: {
      app_role: "florist" | "private_customer" | "business_customer" | "admin";
      order_source: "direct" | "referral";
      order_status:
        | "draft"
        | "pending_payment"
        | "paid"
        | "accepted"
        | "in_production"
        | "out_for_delivery"
        | "completed"
        | "cancelled"
        | "refunded";
      payout_status: "pending" | "scheduled" | "paid" | "failed" | "reversed";
    };
    Tables: {
      florist_profiles: {
        Row: {
          accepts_referrals: boolean;
          bio: string | null;
          city: string;
          country_code: string;
          created_at: string;
          delivery_radius_km: number | null;
          email: string | null;
          fulfills_orders: boolean;
          id: string;
          instagram_handle: string | null;
          onboarding_completed_at: string | null;
          phone: string | null;
          postal_code: string | null;
          profile_id: string;
          shop_name: string;
          slug: string;
          street_address: string | null;
          stripe_account_id: string | null;
          stripe_onboarding_complete: boolean;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          accepts_referrals?: boolean;
          bio?: string | null;
          city: string;
          country_code?: string;
          created_at?: string;
          delivery_radius_km?: number | null;
          email?: string | null;
          fulfills_orders?: boolean;
          id?: string;
          instagram_handle?: string | null;
          onboarding_completed_at?: string | null;
          phone?: string | null;
          postal_code?: string | null;
          profile_id: string;
          shop_name: string;
          slug: string;
          street_address?: string | null;
          stripe_account_id?: string | null;
          stripe_onboarding_complete?: boolean;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          accepts_referrals?: boolean;
          bio?: string | null;
          city?: string;
          country_code?: string;
          created_at?: string;
          delivery_radius_km?: number | null;
          email?: string | null;
          fulfills_orders?: boolean;
          id?: string;
          instagram_handle?: string | null;
          onboarding_completed_at?: string | null;
          phone?: string | null;
          postal_code?: string | null;
          profile_id?: string;
          shop_name?: string;
          slug?: string;
          street_address?: string | null;
          stripe_account_id?: string | null;
          stripe_onboarding_complete?: boolean;
          updated_at?: string;
          website_url?: string | null;
        };
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          line_total_amount: number;
          order_id: string;
          product_id: string | null;
          product_title: string;
          quantity: number;
          unit_price_amount: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          line_total_amount: number;
          order_id: string;
          product_id?: string | null;
          product_title: string;
          quantity: number;
          unit_price_amount: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          line_total_amount?: number;
          order_id?: string;
          product_id?: string | null;
          product_title?: string;
          quantity?: number;
          unit_price_amount?: number;
        };
      };
      orders: {
        Row: {
          card_message: string | null;
          created_at: string;
          currency: string;
          customer_profile_id: string | null;
          delivery_address: string | null;
          delivery_city: string | null;
          delivery_date: string | null;
          delivery_fee_amount: number;
          delivery_postal_code: string | null;
          executor_amount: number;
          executor_florist_profile_id: string;
          id: string;
          notes: string | null;
          order_number: number;
          platform_amount: number;
          recipient_name: string;
          recipient_phone: string | null;
          seller_amount: number;
          seller_florist_profile_id: string | null;
          source: Database["public"]["Enums"]["order_source"];
          status: Database["public"]["Enums"]["order_status"];
          stripe_checkout_session_id: string | null;
          stripe_fee_amount: number;
          stripe_payment_intent_id: string | null;
          subtotal_amount: number;
          total_amount: number;
          updated_at: string;
        };
        Insert: {
          card_message?: string | null;
          created_at?: string;
          currency?: string;
          customer_profile_id?: string | null;
          delivery_address?: string | null;
          delivery_city?: string | null;
          delivery_date?: string | null;
          delivery_fee_amount?: number;
          delivery_postal_code?: string | null;
          executor_amount?: number;
          executor_florist_profile_id: string;
          id?: string;
          notes?: string | null;
          platform_amount?: number;
          recipient_name: string;
          recipient_phone?: string | null;
          seller_amount?: number;
          seller_florist_profile_id?: string | null;
          source?: Database["public"]["Enums"]["order_source"];
          status?: Database["public"]["Enums"]["order_status"];
          stripe_checkout_session_id?: string | null;
          stripe_fee_amount?: number;
          stripe_payment_intent_id?: string | null;
          subtotal_amount: number;
          total_amount: number;
          updated_at?: string;
        };
        Update: {
          card_message?: string | null;
          created_at?: string;
          currency?: string;
          customer_profile_id?: string | null;
          delivery_address?: string | null;
          delivery_city?: string | null;
          delivery_date?: string | null;
          delivery_fee_amount?: number;
          delivery_postal_code?: string | null;
          executor_amount?: number;
          executor_florist_profile_id?: string;
          id?: string;
          notes?: string | null;
          platform_amount?: number;
          recipient_name?: string;
          recipient_phone?: string | null;
          seller_amount?: number;
          seller_florist_profile_id?: string | null;
          source?: Database["public"]["Enums"]["order_source"];
          status?: Database["public"]["Enums"]["order_status"];
          stripe_checkout_session_id?: string | null;
          stripe_fee_amount?: number;
          stripe_payment_intent_id?: string | null;
          subtotal_amount?: number;
          total_amount?: number;
          updated_at?: string;
        };
      };
      payout_records: {
        Row: {
          amount: number;
          available_on: string | null;
          created_at: string;
          currency: string;
          failure_reason: string | null;
          id: string;
          order_id: string;
          paid_at: string | null;
          recipient_florist_profile_id: string | null;
          recipient_profile_id: string | null;
          recipient_role: Database["public"]["Enums"]["app_role"];
          status: Database["public"]["Enums"]["payout_status"];
          stripe_transfer_id: string | null;
          updated_at: string;
        };
        Insert: {
          amount: number;
          available_on?: string | null;
          created_at?: string;
          currency?: string;
          failure_reason?: string | null;
          id?: string;
          order_id: string;
          paid_at?: string | null;
          recipient_florist_profile_id?: string | null;
          recipient_profile_id?: string | null;
          recipient_role: Database["public"]["Enums"]["app_role"];
          status?: Database["public"]["Enums"]["payout_status"];
          stripe_transfer_id?: string | null;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          available_on?: string | null;
          created_at?: string;
          currency?: string;
          failure_reason?: string | null;
          id?: string;
          order_id?: string;
          paid_at?: string | null;
          recipient_florist_profile_id?: string | null;
          recipient_profile_id?: string | null;
          recipient_role?: Database["public"]["Enums"]["app_role"];
          status?: Database["public"]["Enums"]["payout_status"];
          stripe_transfer_id?: string | null;
          updated_at?: string;
        };
      };
      stripe_webhook_events: {
        Row: {
          created_at: string;
          id: string;
          processed_at: string | null;
          processing_error: string | null;
          type: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          processed_at?: string | null;
          processing_error?: string | null;
          type: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          processed_at?: string | null;
          processing_error?: string | null;
          type?: string;
        };
      };
      products: {
        Row: {
          category: string | null;
          created_at: string;
          currency: string;
          description: string | null;
          florist_profile_id: string;
          id: string;
          image_url: string | null;
          is_active: boolean;
          occasion: string | null;
          price_amount: number;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          currency?: string;
          description?: string | null;
          florist_profile_id: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          occasion?: string | null;
          price_amount: number;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          currency?: string;
          description?: string | null;
          florist_profile_id?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          occasion?: string | null;
          price_amount?: number;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          city: string | null;
          company_name: string | null;
          country_code: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          is_active: boolean;
          phone: string | null;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          city?: string | null;
          company_name?: string | null;
          country_code?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          is_active?: boolean;
          phone?: string | null;
          role: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          city?: string | null;
          company_name?: string | null;
          country_code?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
      };
    };
  };
};
