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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      image: {
        Row: {
          created_at: string
          id: string
          image_hash: string
          image_url: string | null
          status: Database["public"]["Enums"]["image_status"]
          with_items: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          image_hash: string
          image_url?: string | null
          status?: Database["public"]["Enums"]["image_status"]
          with_items?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          image_hash?: string
          image_url?: string | null
          status?: Database["public"]["Enums"]["image_status"]
          with_items?: boolean
        }
        Relationships: []
      }
      item: {
        Row: {
          ambiguity: boolean | null
          bboxes: Json | null
          brand: string | null
          center: Json | null
          created_at: string | null
          cropped_image_path: string | null
          description: string | null
          id: number
          image_id: string
          price: string | null
          product_name: string | null
          sam_prompt: string | null
          scores: Json | null
          status: string | null
        }
        Insert: {
          ambiguity?: boolean | null
          bboxes?: Json | null
          brand?: string | null
          center?: Json | null
          created_at?: string | null
          cropped_image_path?: string | null
          description?: string | null
          id?: number
          image_id: string
          price?: string | null
          product_name?: string | null
          sam_prompt?: string | null
          scores?: Json | null
          status?: string | null
        }
        Update: {
          ambiguity?: boolean | null
          bboxes?: Json | null
          brand?: string | null
          center?: Json | null
          created_at?: string | null
          cropped_image_path?: string | null
          description?: string | null
          id?: number
          image_id?: string
          price?: string | null
          product_name?: string | null
          sam_prompt?: string | null
          scores?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image"
            referencedColumns: ["id"]
          },
        ]
      }
      post: {
        Row: {
          account: string
          article: string | null
          created_at: string
          id: string
          item_ids: Json | null
          metadata: string[] | null
          ts: string
        }
        Insert: {
          account: string
          article?: string | null
          created_at?: string
          id?: string
          item_ids?: Json | null
          metadata?: string[] | null
          ts: string
        }
        Update: {
          account?: string
          article?: string | null
          created_at?: string
          id?: string
          item_ids?: Json | null
          metadata?: string[] | null
          ts?: string
        }
        Relationships: []
      }
      post_image: {
        Row: {
          created_at: string
          curated_item_ids: Json | null
          image_id: string
          item_locations: Json | null
          item_locations_updated_at: string | null
          post_id: string
        }
        Insert: {
          created_at?: string
          curated_item_ids?: Json | null
          image_id: string
          item_locations?: Json | null
          item_locations_updated_at?: string | null
          post_id: string
        }
        Update: {
          created_at?: string
          curated_item_ids?: Json | null
          image_id?: string
          item_locations?: Json | null
          item_locations_updated_at?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_image_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_image_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      image_status: "pending" | "extracted" | "skipped" | "extracted_metadata"
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
      image_status: ["pending", "extracted", "skipped", "extracted_metadata"],
    },
  },
} as const

// Type aliases for convenience
export type ImageRow = Database["public"]["Tables"]["image"]["Row"]
