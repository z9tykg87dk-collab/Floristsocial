export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      business_customers: {
        Row: {
          billing_address: string | null
          company_name: string | null
          contact_name: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          organization_number: string | null
          phone: string | null
          reference_number: string | null
        }
        Insert: {
          billing_address?: string | null
          company_name?: string | null
          contact_name?: string | null
          created_at?: string | null
          email: string
          id: string
          is_active?: boolean | null
          organization_number?: string | null
          phone?: string | null
          reference_number?: string | null
        }
        Update: {
          billing_address?: string | null
          company_name?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          organization_number?: string | null
          phone?: string | null
          reference_number?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          ends_at: string | null
          id: string
          owner_id: string
          owner_role: string
          priority: string
          source: string
          source_record_id: string | null
          starts_at: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          ends_at?: string | null
          id?: string
          owner_id: string
          owner_role: string
          priority?: string
          source: string
          source_record_id?: string | null
          starts_at: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          owner_id?: string
          owner_role?: string
          priority?: string
          source?: string
          source_record_id?: string | null
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      collection_products: {
        Row: {
          collection_id: string
          created_at: string | null
          id: string
          product_id: string
          sort_order: number | null
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          id?: string
          product_id: string
          sort_order?: number | null
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          id?: string
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          florist_id: string | null
          id: string
          is_public: boolean | null
          slug: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          florist_id?: string | null
          id?: string
          is_public?: boolean | null
          slug?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          florist_id?: string | null
          id?: string
          is_public?: boolean | null
          slug?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_florist_id_fkey"
            columns: ["florist_id"]
            isOneToOne: false
            referencedRelation: "florists"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          auth_user_id: string | null
          blocked_reason: string | null
          city: string | null
          company_address: string
          company_name: string
          contact_email: string
          contact_person: string
          contact_phone: string
          country: string | null
          created_at: string | null
          credit_limit: number | null
          customer_number: string
          id: string
          internal_blacklist: boolean | null
          invoice_address: string
          invoice_allowed: boolean | null
          invoice_method: string
          invoice_status: string
          legal_company_name: string | null
          manual_review_note: string | null
          manual_review_required: boolean | null
          organization_number: string
          payment_terms: string | null
          postal_code: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          blocked_reason?: string | null
          city?: string | null
          company_address: string
          company_name: string
          contact_email: string
          contact_person: string
          contact_phone: string
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          customer_number: string
          id?: string
          internal_blacklist?: boolean | null
          invoice_address: string
          invoice_allowed?: boolean | null
          invoice_method?: string
          invoice_status?: string
          legal_company_name?: string | null
          manual_review_note?: string | null
          manual_review_required?: boolean | null
          organization_number: string
          payment_terms?: string | null
          postal_code?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          blocked_reason?: string | null
          city?: string | null
          company_address?: string
          company_name?: string
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          customer_number?: string
          id?: string
          internal_blacklist?: boolean | null
          invoice_address?: string
          invoice_allowed?: boolean | null
          invoice_method?: string
          invoice_status?: string
          legal_company_name?: string | null
          manual_review_note?: string | null
          manual_review_required?: boolean | null
          organization_number?: string
          payment_terms?: string | null
          postal_code?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          avatar_url: string | null
          conversation_id: string | null
          created_at: string | null
          display_name: string | null
          florist_id: string | null
          florist_name: string | null
          id: string
          joined_at: string | null
          last_read_at: string | null
          logo_url: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          conversation_id?: string | null
          created_at?: string | null
          display_name?: string | null
          florist_id?: string | null
          florist_name?: string | null
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          logo_url?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          conversation_id?: string | null
          created_at?: string | null
          display_name?: string | null
          florist_id?: string | null
          florist_name?: string | null
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          logo_url?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_florist_id_fkey"
            columns: ["florist_id"]
            isOneToOne: false
            referencedRelation: "florists"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          florist_1: string
          florist_2: string
          id: string
          last_message_at: string | null
          order_id: string | null
          outcome: string | null
          referral_id: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          florist_1: string
          florist_2: string
          id?: string
          last_message_at?: string | null
          order_id?: string | null
          outcome?: string | null
          referral_id?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          florist_1?: string
          florist_2?: string
          id?: string
          last_message_at?: string | null
          order_id?: string | null
          outcome?: string | null
          referral_id?: string | null
          title?: string | null
          type?: string | null
        }
        Relationships: []
      }
      florist_closed_days: {
        Row: {
          closed_date: string | null
          closed_label: string
          created_at: string
          florist_profile_id: string
          id: string
          reason: string | null
        }
        Insert: {
          closed_date?: string | null
          closed_label: string
          created_at?: string
          florist_profile_id: string
          id?: string
          reason?: string | null
        }
        Update: {
          closed_date?: string | null
          closed_label?: string
          created_at?: string
          florist_profile_id?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "florist_closed_days_florist_profile_id_fkey"
            columns: ["florist_profile_id"]
            isOneToOne: false
            referencedRelation: "florist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      florist_delivery_areas: {
        Row: {
          area: string | null
          city: string
          created_at: string
          delivery_price_amount: number | null
          florist_profile_id: string
          id: string
          postal_code: string | null
          radius_km: number | null
        }
        Insert: {
          area?: string | null
          city: string
          created_at?: string
          delivery_price_amount?: number | null
          florist_profile_id: string
          id?: string
          postal_code?: string | null
          radius_km?: number | null
        }
        Update: {
          area?: string | null
          city?: string
          created_at?: string
          delivery_price_amount?: number | null
          florist_profile_id?: string
          id?: string
          postal_code?: string | null
          radius_km?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "florist_delivery_areas_florist_profile_id_fkey"
            columns: ["florist_profile_id"]
            isOneToOne: false
            referencedRelation: "florist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      florist_opening_hours: {
        Row: {
          close_time: string | null
          created_at: string
          day_label: string
          florist_profile_id: string
          id: string
          is_closed: boolean
          note: string | null
          open_time: string | null
        }
        Insert: {
          close_time?: string | null
          created_at?: string
          day_label: string
          florist_profile_id: string
          id?: string
          is_closed?: boolean
          note?: string | null
          open_time?: string | null
        }
        Update: {
          close_time?: string | null
          created_at?: string
          day_label?: string
          florist_profile_id?: string
          id?: string
          is_closed?: boolean
          note?: string | null
          open_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "florist_opening_hours_florist_profile_id_fkey"
            columns: ["florist_profile_id"]
            isOneToOne: false
            referencedRelation: "florist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      florist_portfolio_items: {
        Row: {
          created_at: string
          description: string | null
          florist_profile_id: string
          hashtags: string | null
          id: string
          is_public: boolean
          media_type: string | null
          media_url: string | null
          price_amount: number | null
          service_name: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          florist_profile_id: string
          hashtags?: string | null
          id?: string
          is_public?: boolean
          media_type?: string | null
          media_url?: string | null
          price_amount?: number | null
          service_name?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          florist_profile_id?: string
          hashtags?: string | null
          id?: string
          is_public?: boolean
          media_type?: string | null
          media_url?: string | null
          price_amount?: number | null
          service_name?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "florist_portfolio_items_florist_profile_id_fkey"
            columns: ["florist_profile_id"]
            isOneToOne: false
            referencedRelation: "florist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      florist_profiles: {
        Row: {
          accepts_referrals: boolean
          bio: string | null
          city: string
          country_code: string
          created_at: string
          delivery_radius_km: number | null
          email: string | null
          fulfills_orders: boolean
          id: string
          instagram_handle: string | null
          onboarding_completed_at: string | null
          phone: string | null
          postal_code: string | null
          profile_id: string
          shop_name: string
          slug: string
          street_address: string | null
          stripe_account_id: string | null
          stripe_onboarding_complete: boolean
          updated_at: string
          website_url: string | null
        }
        Insert: {
          accepts_referrals?: boolean
          bio?: string | null
          city: string
          country_code?: string
          created_at?: string
          delivery_radius_km?: number | null
          email?: string | null
          fulfills_orders?: boolean
          id?: string
          instagram_handle?: string | null
          onboarding_completed_at?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_id: string
          shop_name: string
          slug: string
          street_address?: string | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          accepts_referrals?: boolean
          bio?: string | null
          city?: string
          country_code?: string
          created_at?: string
          delivery_radius_km?: number | null
          email?: string | null
          fulfills_orders?: boolean
          id?: string
          instagram_handle?: string | null
          onboarding_completed_at?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_id?: string
          shop_name?: string
          slug?: string
          street_address?: string | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "florist_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      florist_services: {
        Row: {
          created_at: string
          description: string | null
          florist_profile_id: string
          id: string
          is_active: boolean
          minimum_price_amount: number | null
          price_level: string | null
          service_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          florist_profile_id: string
          id?: string
          is_active?: boolean
          minimum_price_amount?: number | null
          price_level?: string | null
          service_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          florist_profile_id?: string
          id?: string
          is_active?: boolean
          minimum_price_amount?: number | null
          price_level?: string | null
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "florist_services_florist_profile_id_fkey"
            columns: ["florist_profile_id"]
            isOneToOne: false
            referencedRelation: "florist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      florists: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          admin_note: string | null
          admin_owner: string | null
          area: string | null
          bio: string | null
          business_instagram: string | null
          calendar_events: Json | null
          city: string | null
          closed_dates: Json | null
          country: string | null
          county: string | null
          cover_image_medium_url: string | null
          cover_image_original_url: string | null
          cover_image_path: string | null
          cover_image_thumbnail_url: string | null
          cover_image_url: string | null
          created_at: string | null
          delivery_areas: Json | null
          delivery_model: string | null
          delivery_radius_km: number | null
          description: string | null
          edit_policy: Json | null
          email: string
          express_delivery_available: boolean | null
          express_delivery_fee: number | null
          first_name: string | null
          florist_name: string | null
          general_portfolio_items: Json | null
          holiday_overrides: Json | null
          id: string
          instagram: string | null
          is_active: boolean | null
          last_name: string | null
          latitude: number | null
          legal_business_name: string | null
          logo_medium_url: string | null
          logo_original_url: string | null
          logo_path: string | null
          logo_thumbnail_url: string | null
          logo_url: string | null
          longitude: number | null
          masked_organization_number: string | null
          minimum_booking_value: string | null
          municipality: string | null
          offer: string | null
          opening_hours: Json | null
          organization_number: string | null
          owner_email: string | null
          owner_phone: string | null
          password: string | null
          phone: string | null
          plan: string | null
          portfolio_images: Json | null
          postal_code: string | null
          price_level: string | null
          profile_image_medium_url: string | null
          profile_image_original_url: string | null
          profile_image_path: string | null
          profile_image_thumbnail_url: string | null
          profile_image_url: string | null
          profile_name: string | null
          public_email: string | null
          rating: number | null
          review_count: number | null
          role: string | null
          same_day_cutoff_time: string | null
          seasonal_closures: Json | null
          service_portfolio_items: Json | null
          services: Json | null
          shop_name: string | null
          slug: string | null
          standard_delivery_fee: number | null
          status: string | null
          stripe_account_id: string | null
          styles: Json | null
          team_size: string | null
          updated_at: string | null
          website: string | null
          years_in_business: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          admin_note?: string | null
          admin_owner?: string | null
          area?: string | null
          bio?: string | null
          business_instagram?: string | null
          calendar_events?: Json | null
          city?: string | null
          closed_dates?: Json | null
          country?: string | null
          county?: string | null
          cover_image_medium_url?: string | null
          cover_image_original_url?: string | null
          cover_image_path?: string | null
          cover_image_thumbnail_url?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          delivery_areas?: Json | null
          delivery_model?: string | null
          delivery_radius_km?: number | null
          description?: string | null
          edit_policy?: Json | null
          email: string
          express_delivery_available?: boolean | null
          express_delivery_fee?: number | null
          first_name?: string | null
          florist_name?: string | null
          general_portfolio_items?: Json | null
          holiday_overrides?: Json | null
          id?: string
          instagram?: string | null
          is_active?: boolean | null
          last_name?: string | null
          latitude?: number | null
          legal_business_name?: string | null
          logo_medium_url?: string | null
          logo_original_url?: string | null
          logo_path?: string | null
          logo_thumbnail_url?: string | null
          logo_url?: string | null
          longitude?: number | null
          masked_organization_number?: string | null
          minimum_booking_value?: string | null
          municipality?: string | null
          offer?: string | null
          opening_hours?: Json | null
          organization_number?: string | null
          owner_email?: string | null
          owner_phone?: string | null
          password?: string | null
          phone?: string | null
          plan?: string | null
          portfolio_images?: Json | null
          postal_code?: string | null
          price_level?: string | null
          profile_image_medium_url?: string | null
          profile_image_original_url?: string | null
          profile_image_path?: string | null
          profile_image_thumbnail_url?: string | null
          profile_image_url?: string | null
          profile_name?: string | null
          public_email?: string | null
          rating?: number | null
          review_count?: number | null
          role?: string | null
          same_day_cutoff_time?: string | null
          seasonal_closures?: Json | null
          service_portfolio_items?: Json | null
          services?: Json | null
          shop_name?: string | null
          slug?: string | null
          standard_delivery_fee?: number | null
          status?: string | null
          stripe_account_id?: string | null
          styles?: Json | null
          team_size?: string | null
          updated_at?: string | null
          website?: string | null
          years_in_business?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          admin_note?: string | null
          admin_owner?: string | null
          area?: string | null
          bio?: string | null
          business_instagram?: string | null
          calendar_events?: Json | null
          city?: string | null
          closed_dates?: Json | null
          country?: string | null
          county?: string | null
          cover_image_medium_url?: string | null
          cover_image_original_url?: string | null
          cover_image_path?: string | null
          cover_image_thumbnail_url?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          delivery_areas?: Json | null
          delivery_model?: string | null
          delivery_radius_km?: number | null
          description?: string | null
          edit_policy?: Json | null
          email?: string
          express_delivery_available?: boolean | null
          express_delivery_fee?: number | null
          first_name?: string | null
          florist_name?: string | null
          general_portfolio_items?: Json | null
          holiday_overrides?: Json | null
          id?: string
          instagram?: string | null
          is_active?: boolean | null
          last_name?: string | null
          latitude?: number | null
          legal_business_name?: string | null
          logo_medium_url?: string | null
          logo_original_url?: string | null
          logo_path?: string | null
          logo_thumbnail_url?: string | null
          logo_url?: string | null
          longitude?: number | null
          masked_organization_number?: string | null
          minimum_booking_value?: string | null
          municipality?: string | null
          offer?: string | null
          opening_hours?: Json | null
          organization_number?: string | null
          owner_email?: string | null
          owner_phone?: string | null
          password?: string | null
          phone?: string | null
          plan?: string | null
          portfolio_images?: Json | null
          postal_code?: string | null
          price_level?: string | null
          profile_image_medium_url?: string | null
          profile_image_original_url?: string | null
          profile_image_path?: string | null
          profile_image_thumbnail_url?: string | null
          profile_image_url?: string | null
          profile_name?: string | null
          public_email?: string | null
          rating?: number | null
          review_count?: number | null
          role?: string | null
          same_day_cutoff_time?: string | null
          seasonal_closures?: Json | null
          service_portfolio_items?: Json | null
          services?: Json | null
          shop_name?: string | null
          slug?: string | null
          standard_delivery_fee?: number | null
          status?: string | null
          stripe_account_id?: string | null
          styles?: Json | null
          team_size?: string | null
          updated_at?: string | null
          website?: string | null
          years_in_business?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          florist_id: string | null
          follower_id: string
          follower_user_id: string | null
          follower_visitor_id: string | null
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          florist_id?: string | null
          follower_id: string
          follower_user_id?: string | null
          follower_visitor_id?: string | null
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          florist_id?: string | null
          follower_id?: string
          follower_user_id?: string | null
          follower_visitor_id?: string | null
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      gift_cards: {
        Row: {
          amount: number
          buyer_name: string | null
          code: string
          created_at: string | null
          expires_at: string
          id: string
          image_url: string | null
          message: string | null
          purchased_at: string | null
          recipient_email: string | null
          recipient_name: string | null
          recipient_phone: string | null
          redeemed_at: string | null
          redeemed_by_florist_id: string | null
          reminder_sent_at: string | null
          validity_months: number
        }
        Insert: {
          amount: number
          buyer_name?: string | null
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          image_url?: string | null
          message?: string | null
          purchased_at?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          redeemed_at?: string | null
          redeemed_by_florist_id?: string | null
          reminder_sent_at?: string | null
          validity_months: number
        }
        Update: {
          amount?: number
          buyer_name?: string | null
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          image_url?: string | null
          message?: string | null
          purchased_at?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          redeemed_at?: string | null
          redeemed_by_florist_id?: string | null
          reminder_sent_at?: string | null
          validity_months?: number
        }
        Relationships: []
      }
      hashtags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          audio_url: string | null
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          liked_at: string | null
          media_file_name: string | null
          media_mime_type: string | null
          media_url: string | null
          message_type: string | null
          read_at: string | null
          sender_display_name: string | null
          sender_florist_name: string | null
          sender_id: string
          shared_at: string | null
        }
        Insert: {
          audio_url?: string | null
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          liked_at?: string | null
          media_file_name?: string | null
          media_mime_type?: string | null
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          sender_display_name?: string | null
          sender_florist_name?: string | null
          sender_id: string
          shared_at?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          liked_at?: string | null
          media_file_name?: string | null
          media_mime_type?: string | null
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          sender_display_name?: string | null
          sender_florist_name?: string | null
          sender_id?: string
          shared_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "florists"
            referencedColumns: ["id"]
          },
        ]
      }
      order_delivery_updates: {
        Row: {
          attention_reason: string | null
          attention_required: boolean | null
          created_at: string | null
          created_by_name: string | null
          created_by_user_id: string | null
          email_notification_sent_at: string | null
          florist_notified_at: string | null
          id: string
          order_id: string
          raw_message: string | null
          recipient_apartment_number: string | null
          recipient_delivery_note: string | null
          recipient_door_code: string | null
          recipient_floor: string | null
          recipient_housing_type: string | null
          sms_reply_received_at: string | null
          source: string
          update_type: string
        }
        Insert: {
          attention_reason?: string | null
          attention_required?: boolean | null
          created_at?: string | null
          created_by_name?: string | null
          created_by_user_id?: string | null
          email_notification_sent_at?: string | null
          florist_notified_at?: string | null
          id?: string
          order_id: string
          raw_message?: string | null
          recipient_apartment_number?: string | null
          recipient_delivery_note?: string | null
          recipient_door_code?: string | null
          recipient_floor?: string | null
          recipient_housing_type?: string | null
          sms_reply_received_at?: string | null
          source?: string
          update_type?: string
        }
        Update: {
          attention_reason?: string | null
          attention_required?: boolean | null
          created_at?: string | null
          created_by_name?: string | null
          created_by_user_id?: string | null
          email_notification_sent_at?: string | null
          florist_notified_at?: string | null
          id?: string
          order_id?: string
          raw_message?: string | null
          recipient_apartment_number?: string | null
          recipient_delivery_note?: string | null
          recipient_door_code?: string | null
          recipient_floor?: string | null
          recipient_housing_type?: string | null
          sms_reply_received_at?: string | null
          source?: string
          update_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_delivery_updates_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_documents: {
        Row: {
          created_at: string | null
          currency: string | null
          document_number: string | null
          document_type: string
          id: string
          metadata: Json | null
          order_id: string
          pdf_url: string | null
          sent_at: string | null
          sent_to_email: string | null
          status: string
          total_amount: number | null
          vat_amount: number | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          document_number?: string | null
          document_type: string
          id?: string
          metadata?: Json | null
          order_id: string
          pdf_url?: string | null
          sent_at?: string | null
          sent_to_email?: string | null
          status?: string
          total_amount?: number | null
          vat_amount?: number | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          document_number?: string | null
          document_type?: string
          id?: string
          metadata?: Json | null
          order_id?: string
          pdf_url?: string | null
          sent_at?: string | null
          sent_to_email?: string | null
          status?: string
          total_amount?: number | null
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_documents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total_amount: number
          order_id: string
          product_id: string | null
          product_title: string
          quantity: number
          unit_price_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total_amount: number
          order_id: string
          product_id?: string | null
          product_title: string
          quantity: number
          unit_price_amount: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total_amount?: number
          order_id?: string
          product_id?: string | null
          product_title?: string
          quantity?: number
          unit_price_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_sms_logs: {
        Row: {
          created_at: string | null
          direction: string
          from_number: string | null
          id: string
          message: string
          order_id: string | null
          provider: string | null
          provider_message_id: string | null
          raw_payload: Json | null
          status: string | null
          to_number: string | null
        }
        Insert: {
          created_at?: string | null
          direction: string
          from_number?: string | null
          id?: string
          message: string
          order_id?: string | null
          provider?: string | null
          provider_message_id?: string | null
          raw_payload?: Json | null
          status?: string | null
          to_number?: string | null
        }
        Update: {
          created_at?: string | null
          direction?: string
          from_number?: string | null
          id?: string
          message?: string
          order_id?: string | null
          provider?: string | null
          provider_message_id?: string | null
          raw_payload?: Json | null
          status?: string | null
          to_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_sms_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_logs: {
        Row: {
          changed_by_name: string | null
          changed_by_user_id: string | null
          created_at: string | null
          event_type: string
          id: string
          message: string | null
          metadata: Json | null
          new_status: string
          old_status: string | null
          order_id: string
          source: string | null
        }
        Insert: {
          changed_by_name?: string | null
          changed_by_user_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          new_status: string
          old_status?: string | null
          order_id: string
          source?: string | null
        }
        Update: {
          changed_by_name?: string | null
          changed_by_user_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          new_status?: string
          old_status?: string | null
          order_id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_status_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          anonymous_delivery: boolean | null
          buyer_email: string | null
          buyer_name: string | null
          buyer_phone: string | null
          can_hang_on_door: boolean | null
          card_message: string | null
          card_option: string | null
          card_price: number | null
          card_text: string | null
          company_id: string | null
          company_reference: string | null
          created_at: string
          currency: string
          customer_profile_id: string | null
          customer_type: string | null
          delivery_address: string | null
          delivery_attention_required: boolean | null
          delivery_city: string | null
          delivery_date: string | null
          delivery_fee: number | null
          delivery_fee_amount: number
          delivery_method: string | null
          delivery_postal_code: string | null
          delivery_time: string | null
          executor_amount: number
          executor_florist_profile_id: string
          extra_products: Json | null
          extra_products_total: number | null
          florist_email: string | null
          florist_id: string | null
          florist_name: string | null
          florist_phone: string | null
          id: string
          invoice_pdf_url: string | null
          klarna_order_id: string | null
          notes: string | null
          order_number: number
          order_type: string | null
          payment_method: string | null
          payment_status: string | null
          platform_amount: number
          private_customer_id: string | null
          product_id: string | null
          product_image_medium_url: string | null
          product_image_original_url: string | null
          product_image_thumbnail_url: string | null
          product_image_url: string | null
          product_price: number | null
          product_service_name: string | null
          product_style: string | null
          product_title: string | null
          public_tracking_code: string | null
          qr_code_url: string | null
          quantity: number | null
          receipt_pdf_url: string | null
          recipient_address_line_2: string | null
          recipient_apartment_number: string | null
          recipient_city: string | null
          recipient_country: string | null
          recipient_delivery_reply: string | null
          recipient_delivery_reply_received_at: string | null
          recipient_delivery_reply_source: string | null
          recipient_door_code: string | null
          recipient_email: string | null
          recipient_floor: string | null
          recipient_housing_type: string | null
          recipient_name: string
          recipient_phone: string | null
          recipient_postal_code: string | null
          recipient_sms_last_reply_at: string | null
          recipient_sms_message_id: string | null
          recipient_sms_provider: string | null
          recipient_sms_sent_at: string | null
          recipient_street_address: string | null
          selected_order_type: string | null
          selected_style: string | null
          seller_amount: number
          seller_florist_profile_id: string | null
          source: Database["public"]["Enums"]["order_source"]
          special_requests: string | null
          status: Database["public"]["Enums"]["order_status"]
          stripe_checkout_session_id: string | null
          stripe_fee_amount: number
          stripe_payment_intent_id: string | null
          subtotal: number | null
          subtotal_amount: number
          swish_payment_reference: string | null
          total_amount: number
          tracking_url: string | null
          updated_at: string
          vat_amount: number | null
          vat_rate: number | null
        }
        Insert: {
          anonymous_delivery?: boolean | null
          buyer_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          can_hang_on_door?: boolean | null
          card_message?: string | null
          card_option?: string | null
          card_price?: number | null
          card_text?: string | null
          company_id?: string | null
          company_reference?: string | null
          created_at?: string
          currency?: string
          customer_profile_id?: string | null
          customer_type?: string | null
          delivery_address?: string | null
          delivery_attention_required?: boolean | null
          delivery_city?: string | null
          delivery_date?: string | null
          delivery_fee?: number | null
          delivery_fee_amount?: number
          delivery_method?: string | null
          delivery_postal_code?: string | null
          delivery_time?: string | null
          executor_amount?: number
          executor_florist_profile_id: string
          extra_products?: Json | null
          extra_products_total?: number | null
          florist_email?: string | null
          florist_id?: string | null
          florist_name?: string | null
          florist_phone?: string | null
          id?: string
          invoice_pdf_url?: string | null
          klarna_order_id?: string | null
          notes?: string | null
          order_number?: never
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          platform_amount?: number
          private_customer_id?: string | null
          product_id?: string | null
          product_image_medium_url?: string | null
          product_image_original_url?: string | null
          product_image_thumbnail_url?: string | null
          product_image_url?: string | null
          product_price?: number | null
          product_service_name?: string | null
          product_style?: string | null
          product_title?: string | null
          public_tracking_code?: string | null
          qr_code_url?: string | null
          quantity?: number | null
          receipt_pdf_url?: string | null
          recipient_address_line_2?: string | null
          recipient_apartment_number?: string | null
          recipient_city?: string | null
          recipient_country?: string | null
          recipient_delivery_reply?: string | null
          recipient_delivery_reply_received_at?: string | null
          recipient_delivery_reply_source?: string | null
          recipient_door_code?: string | null
          recipient_email?: string | null
          recipient_floor?: string | null
          recipient_housing_type?: string | null
          recipient_name: string
          recipient_phone?: string | null
          recipient_postal_code?: string | null
          recipient_sms_last_reply_at?: string | null
          recipient_sms_message_id?: string | null
          recipient_sms_provider?: string | null
          recipient_sms_sent_at?: string | null
          recipient_street_address?: string | null
          selected_order_type?: string | null
          selected_style?: string | null
          seller_amount?: number
          seller_florist_profile_id?: string | null
          source?: Database["public"]["Enums"]["order_source"]
          special_requests?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_checkout_session_id?: string | null
          stripe_fee_amount?: number
          stripe_payment_intent_id?: string | null
          subtotal?: number | null
          subtotal_amount: number
          swish_payment_reference?: string | null
          total_amount: number
          tracking_url?: string | null
          updated_at?: string
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Update: {
          anonymous_delivery?: boolean | null
          buyer_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          can_hang_on_door?: boolean | null
          card_message?: string | null
          card_option?: string | null
          card_price?: number | null
          card_text?: string | null
          company_id?: string | null
          company_reference?: string | null
          created_at?: string
          currency?: string
          customer_profile_id?: string | null
          customer_type?: string | null
          delivery_address?: string | null
          delivery_attention_required?: boolean | null
          delivery_city?: string | null
          delivery_date?: string | null
          delivery_fee?: number | null
          delivery_fee_amount?: number
          delivery_method?: string | null
          delivery_postal_code?: string | null
          delivery_time?: string | null
          executor_amount?: number
          executor_florist_profile_id?: string
          extra_products?: Json | null
          extra_products_total?: number | null
          florist_email?: string | null
          florist_id?: string | null
          florist_name?: string | null
          florist_phone?: string | null
          id?: string
          invoice_pdf_url?: string | null
          klarna_order_id?: string | null
          notes?: string | null
          order_number?: never
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          platform_amount?: number
          private_customer_id?: string | null
          product_id?: string | null
          product_image_medium_url?: string | null
          product_image_original_url?: string | null
          product_image_thumbnail_url?: string | null
          product_image_url?: string | null
          product_price?: number | null
          product_service_name?: string | null
          product_style?: string | null
          product_title?: string | null
          public_tracking_code?: string | null
          qr_code_url?: string | null
          quantity?: number | null
          receipt_pdf_url?: string | null
          recipient_address_line_2?: string | null
          recipient_apartment_number?: string | null
          recipient_city?: string | null
          recipient_country?: string | null
          recipient_delivery_reply?: string | null
          recipient_delivery_reply_received_at?: string | null
          recipient_delivery_reply_source?: string | null
          recipient_door_code?: string | null
          recipient_email?: string | null
          recipient_floor?: string | null
          recipient_housing_type?: string | null
          recipient_name?: string
          recipient_phone?: string | null
          recipient_postal_code?: string | null
          recipient_sms_last_reply_at?: string | null
          recipient_sms_message_id?: string | null
          recipient_sms_provider?: string | null
          recipient_sms_sent_at?: string | null
          recipient_street_address?: string | null
          selected_order_type?: string | null
          selected_style?: string | null
          seller_amount?: number
          seller_florist_profile_id?: string | null
          source?: Database["public"]["Enums"]["order_source"]
          special_requests?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_checkout_session_id?: string | null
          stripe_fee_amount?: number
          stripe_payment_intent_id?: string | null
          subtotal?: number | null
          subtotal_amount?: number
          swish_payment_reference?: string | null
          total_amount?: number
          tracking_url?: string | null
          updated_at?: string
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_profile_id_fkey"
            columns: ["customer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_executor_florist_profile_id_fkey"
            columns: ["executor_florist_profile_id"]
            isOneToOne: false
            referencedRelation: "florist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_florist_profile_id_fkey"
            columns: ["seller_florist_profile_id"]
            isOneToOne: false
            referencedRelation: "florist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_records: {
        Row: {
          amount: number
          available_on: string | null
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          order_id: string
          paid_at: string | null
          recipient_florist_profile_id: string | null
          recipient_profile_id: string | null
          recipient_role: string
          status: Database["public"]["Enums"]["payout_status"]
          stripe_transfer_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          available_on?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          order_id: string
          paid_at?: string | null
          recipient_florist_profile_id?: string | null
          recipient_profile_id?: string | null
          recipient_role: string
          status?: Database["public"]["Enums"]["payout_status"]
          stripe_transfer_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          available_on?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          order_id?: string
          paid_at?: string | null
          recipient_florist_profile_id?: string | null
          recipient_profile_id?: string | null
          recipient_role?: string
          status?: Database["public"]["Enums"]["payout_status"]
          stripe_transfer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_records_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_records_recipient_florist_profile_id_fkey"
            columns: ["recipient_florist_profile_id"]
            isOneToOne: false
            referencedRelation: "florist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_records_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_hidden: boolean | null
          is_public: boolean | null
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_hidden?: boolean | null
          is_public?: boolean | null
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_hidden?: boolean | null
          is_public?: boolean | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_hashtags: {
        Row: {
          created_at: string | null
          hashtag_id: string
          id: string
          post_id: string
        }
        Insert: {
          created_at?: string | null
          hashtag_id: string
          id?: string
          post_id: string
        }
        Update: {
          created_at?: string | null
          hashtag_id?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_hashtags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_hashtags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_saves: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_user_id: string | null
          caption: string
          category: string | null
          city: string | null
          color_palette: string[] | null
          comment_count: number | null
          country: string | null
          created_at: string | null
          description: string | null
          florist_id: string | null
          hashtags: string | null
          id: string
          image_alt: string | null
          image_height: number | null
          image_medium_url: string | null
          image_original_url: string | null
          image_thumbnail_url: string | null
          image_url: string | null
          image_width: number | null
          is_featured: boolean | null
          is_public: boolean | null
          is_shoppable: boolean | null
          is_sponsored: boolean | null
          like_count: number | null
          media_type: string | null
          occasion: string | null
          price: number | null
          product_id: string | null
          save_count: number | null
          style: string | null
          title: string | null
          updated_at: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          author_user_id?: string | null
          caption: string
          category?: string | null
          city?: string | null
          color_palette?: string[] | null
          comment_count?: number | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          florist_id?: string | null
          hashtags?: string | null
          id?: string
          image_alt?: string | null
          image_height?: number | null
          image_medium_url?: string | null
          image_original_url?: string | null
          image_thumbnail_url?: string | null
          image_url?: string | null
          image_width?: number | null
          is_featured?: boolean | null
          is_public?: boolean | null
          is_shoppable?: boolean | null
          is_sponsored?: boolean | null
          like_count?: number | null
          media_type?: string | null
          occasion?: string | null
          price?: number | null
          product_id?: string | null
          save_count?: number | null
          style?: string | null
          title?: string | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          author_user_id?: string | null
          caption?: string
          category?: string | null
          city?: string | null
          color_palette?: string[] | null
          comment_count?: number | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          florist_id?: string | null
          hashtags?: string | null
          id?: string
          image_alt?: string | null
          image_height?: number | null
          image_medium_url?: string | null
          image_original_url?: string | null
          image_thumbnail_url?: string | null
          image_url?: string | null
          image_width?: number | null
          is_featured?: boolean | null
          is_public?: boolean | null
          is_shoppable?: boolean | null
          is_sponsored?: boolean | null
          like_count?: number | null
          media_type?: string | null
          occasion?: string | null
          price?: number | null
          product_id?: string | null
          save_count?: number | null
          style?: string | null
          title?: string | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_florist_id_fkey"
            columns: ["florist_id"]
            isOneToOne: false
            referencedRelation: "florists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "posts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      private_customers: {
        Row: {
          address_line_2: string | null
          auth_user_id: string | null
          city: string | null
          country: string | null
          created_at: string | null
          customer_number: string | null
          default_address: string | null
          email: string
          favorite_styles: Json | null
          first_name: string | null
          id: string
          important_dates: Json | null
          is_active: boolean | null
          last_name: string | null
          newsletter_opt_in: boolean | null
          phone: string | null
          postal_code: string | null
          saved_addresses: Json | null
          sms_notifications: boolean | null
          street_address: string | null
          updated_at: string | null
        }
        Insert: {
          address_line_2?: string | null
          auth_user_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          customer_number?: string | null
          default_address?: string | null
          email: string
          favorite_styles?: Json | null
          first_name?: string | null
          id: string
          important_dates?: Json | null
          is_active?: boolean | null
          last_name?: string | null
          newsletter_opt_in?: boolean | null
          phone?: string | null
          postal_code?: string | null
          saved_addresses?: Json | null
          sms_notifications?: boolean | null
          street_address?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line_2?: string | null
          auth_user_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          customer_number?: string | null
          default_address?: string | null
          email?: string
          favorite_styles?: Json | null
          first_name?: string | null
          id?: string
          important_dates?: Json | null
          is_active?: boolean | null
          last_name?: string | null
          newsletter_opt_in?: boolean | null
          phone?: string | null
          postal_code?: string | null
          saved_addresses?: Json | null
          sms_notifications?: boolean | null
          street_address?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          label: string
          price: number
          product_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          label: string
          price: number
          product_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          label?: string
          price?: number
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allow_custom_message: boolean | null
          allow_inspiration_upload: boolean | null
          allow_price_upgrade: boolean | null
          base_price: number | null
          category: string | null
          created_at: string | null
          currency: string | null
          delivery_available: boolean | null
          description: string | null
          florist_id: string | null
          florist_profile_id: string | null
          id: string
          image_alt: string | null
          image_medium_url: string | null
          image_original_url: string | null
          image_thumbnail_url: string | null
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_public: boolean | null
          is_sponsored: boolean | null
          min_price: number | null
          occasion: string | null
          pickup_available: boolean | null
          post_id: string | null
          price_amount: number
          price_currency: string | null
          purchase_count: number | null
          save_count: number | null
          seasonal_disclaimer: string | null
          service_name: string | null
          slug: string | null
          style: string | null
          title: string
          updated_at: string | null
          vat_rate: number | null
          view_count: number | null
        }
        Insert: {
          allow_custom_message?: boolean | null
          allow_inspiration_upload?: boolean | null
          allow_price_upgrade?: boolean | null
          base_price?: number | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_available?: boolean | null
          description?: string | null
          florist_id?: string | null
          florist_profile_id?: string | null
          id?: string
          image_alt?: string | null
          image_medium_url?: string | null
          image_original_url?: string | null
          image_thumbnail_url?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          is_sponsored?: boolean | null
          min_price?: number | null
          occasion?: string | null
          pickup_available?: boolean | null
          post_id?: string | null
          price_amount: number
          price_currency?: string | null
          purchase_count?: number | null
          save_count?: number | null
          seasonal_disclaimer?: string | null
          service_name?: string | null
          slug?: string | null
          style?: string | null
          title: string
          updated_at?: string | null
          vat_rate?: number | null
          view_count?: number | null
        }
        Update: {
          allow_custom_message?: boolean | null
          allow_inspiration_upload?: boolean | null
          allow_price_upgrade?: boolean | null
          base_price?: number | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_available?: boolean | null
          description?: string | null
          florist_id?: string | null
          florist_profile_id?: string | null
          id?: string
          image_alt?: string | null
          image_medium_url?: string | null
          image_original_url?: string | null
          image_thumbnail_url?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          is_sponsored?: boolean | null
          min_price?: number | null
          occasion?: string | null
          pickup_available?: boolean | null
          post_id?: string | null
          price_amount?: number
          price_currency?: string | null
          purchase_count?: number | null
          save_count?: number | null
          seasonal_disclaimer?: string | null
          service_name?: string | null
          slug?: string | null
          style?: string | null
          title?: string
          updated_at?: string | null
          vat_rate?: number | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_florist_id_fkey"
            columns: ["florist_id"]
            isOneToOne: false
            referencedRelation: "florists"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          company_name: string | null
          country_code: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          role: string | null
          stripe_account_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          company_name?: string | null
          country_code?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          role?: string | null
          stripe_account_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          company_name?: string | null
          country_code?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string | null
          stripe_account_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token_hash: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token_hash: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token_hash?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "florists"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          caption: string | null
          created_at: string | null
          expires_at: string | null
          florist_id: string
          id: string
          image_url: string | null
          is_public: boolean | null
          link_url: string | null
          media_type: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          expires_at?: string | null
          florist_id: string
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          link_url?: string | null
          media_type?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          expires_at?: string | null
          florist_id?: string
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          link_url?: string | null
          media_type?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_florist_id_fkey"
            columns: ["florist_id"]
            isOneToOne: false
            referencedRelation: "florists"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          created_at: string
          id: string
          processed_at: string | null
          processing_error: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id: string
          processed_at?: string | null
          processing_error?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          processed_at?: string | null
          processing_error?: string | null
          type?: string
        }
        Relationships: []
      }
      trust_ratings: {
        Row: {
          average_rating: number | null
          color: number
          comment: string | null
          created_at: string | null
          customer_id: string
          delivery: number
          design: number
          florist_id: string
          id: string
          order_id: string
          quality: number
          recommendation_score: number | null
          response_time: number | null
          reviewed_at: string | null
          verified_purchase: boolean
          would_order_again: boolean | null
        }
        Insert: {
          average_rating?: number | null
          color: number
          comment?: string | null
          created_at?: string | null
          customer_id: string
          delivery: number
          design: number
          florist_id: string
          id?: string
          order_id: string
          quality: number
          recommendation_score?: number | null
          response_time?: number | null
          reviewed_at?: string | null
          verified_purchase?: boolean
          would_order_again?: boolean | null
        }
        Update: {
          average_rating?: number | null
          color?: number
          comment?: string | null
          created_at?: string | null
          customer_id?: string
          delivery?: number
          design?: number
          florist_id?: string
          id?: string
          order_id?: string
          quality?: number
          recommendation_score?: number | null
          response_time?: number | null
          reviewed_at?: string | null
          verified_purchase?: boolean
          would_order_again?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      feed_items: {
        Row: {
          allow_price_upgrade: boolean | null
          base_price: number | null
          caption: string | null
          category: string | null
          city: string | null
          comment_count: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          florist_id: string | null
          florist_logo_url: string | null
          florist_name: string | null
          florist_slug: string | null
          hashtags: string | null
          id: string | null
          image_alt: string | null
          image_medium_url: string | null
          image_original_url: string | null
          image_thumbnail_url: string | null
          is_featured: boolean | null
          is_shoppable: boolean | null
          is_sponsored: boolean | null
          like_count: number | null
          media_type: string | null
          occasion: string | null
          product_id: string | null
          product_title: string | null
          save_count: number | null
          seasonal_disclaimer: string | null
          style: string | null
          video_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_florist_id_fkey"
            columns: ["florist_id"]
            isOneToOne: false
            referencedRelation: "florists"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      apply_delivery_update_to_order: {
        Args: { update_id: string }
        Returns: undefined
      }
      earth: { Args: never; Returns: number }
      find_nearby_florists: {
        Args: {
          max_distance_km?: number
          recipient_lat: number
          recipient_lng: number
        }
        Returns: {
          area: string
          city: string
          delivery_radius_km: number
          distance_km: number
          express_delivery_available: boolean
          express_delivery_fee: number
          florist_id: string
          florist_name: string
          latitude: number
          logo_url: string
          longitude: number
          opening_hours: Json
          profile_image_url: string
          rating: number
          review_count: number
          same_day_cutoff_time: string
          shop_name: string
          standard_delivery_fee: number
        }[]
      }
      send_gift_card_expiry_reminders: { Args: never; Returns: undefined }
    }
    Enums: {
      order_source: "direct" | "referral"
      order_status:
        | "draft"
        | "pending_payment"
        | "paid"
        | "accepted"
        | "in_production"
        | "out_for_delivery"
        | "completed"
        | "cancelled"
        | "refunded"
      payout_status:
        | "pending"
        | "scheduled"
        | "paid"
        | "failed"
        | "reversed"
        | "transferred"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_source: ["direct", "referral"],
      order_status: [
        "draft",
        "pending_payment",
        "paid",
        "accepted",
        "in_production",
        "out_for_delivery",
        "completed",
        "cancelled",
        "refunded",
      ],
      payout_status: [
        "pending",
        "scheduled",
        "paid",
        "failed",
        "reversed",
        "transferred",
      ],
    },
  },
} as const
