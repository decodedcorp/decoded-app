// Supabase Database Types
// Generated from Supabase project: pdgvuwrxsfwrypadwdlu
//
// Type Update Rule:
// When Supabase schema changes, regenerate types using:
//   supabase gen types typescript --project-id pdgvuwrxsfwrypadwdlu > lib/supabase/types.ts
//
// Update workflow: schema change → types regeneration → build/typecheck
// Note: MCP can be used for type review/summary, but actual file should be generated via Supabase CLI
// Last updated: 2025-12-18 (Added missing fields: item.description, post.article, post_image.item_locations, post_image.item_locations_updated_at)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      image: {
        Row: {
          created_at: string;
          id: string;
          image_hash: string;
          image_url: string | null;
          status: Database["public"]["Enums"]["image_status"];
          with_items: boolean;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_hash: string;
          image_url?: string | null;
          status?: Database["public"]["Enums"]["image_status"];
          with_items?: boolean;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_hash?: string;
          image_url?: string | null;
          status?: Database["public"]["Enums"]["image_status"];
          with_items?: boolean;
        };
        Relationships: [];
      };
      item: {
        Row: {
          id: string;
          created_at: string | null;
          image_id: string;
          brand: string | null;
          product_name: string | null;
          price: string | null;
          center: Json | null;
          sam_prompt: string | null;
          bboxes: Json | null;
          scores: Json | null;
          ambiguity: boolean | null;
          cropped_image_path: string | null;
          status: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          image_id: string;
          brand?: string | null;
          product_name?: string | null;
          price?: string | null;
          center?: Json | null;
          sam_prompt?: string | null;
          bboxes?: Json | null;
          scores?: Json | null;
          ambiguity?: boolean | null;
          cropped_image_path?: string | null;
          status?: string | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          image_id?: string;
          brand?: string | null;
          product_name?: string | null;
          price?: string | null;
          center?: Json | null;
          sam_prompt?: string | null;
          bboxes?: Json | null;
          scores?: Json | null;
          ambiguity?: boolean | null;
          cropped_image_path?: string | null;
          status?: string | null;
          description?: string | null;
        };
        Relationships: [];
      };
      post: {
        Row: {
          account: string;
          created_at: string;
          id: string;
          ts: string;
          item_ids: Json | null;
          article: string | null;
        };
        Insert: {
          account: string;
          created_at?: string;
          id?: string;
          ts: string;
          item_ids?: Json | null;
          article?: string | null;
        };
        Update: {
          account?: string;
          created_at?: string;
          id?: string;
          ts?: string;
          item_ids?: Json | null;
          article?: string | null;
        };
        Relationships: [];
      };
      post_image: {
        Row: {
          created_at: string;
          image_id: string;
          post_id: string;
          item_locations: Json | null;
          item_locations_updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          image_id: string;
          post_id: string;
          item_locations?: Json | null;
          item_locations_updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          image_id?: string;
          post_id?: string;
          item_locations?: Json | null;
          item_locations_updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "post_image_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "image";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_image_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "post";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      image_status: "pending" | "extracted" | "skipped" | "extracted_metadata";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      image_status: ["pending", "extracted", "skipped", "extracted_metadata"],
    },
  },
} as const;

// Main frontend feed source
export type ImageRow = Database["public"]["Tables"]["image"]["Row"];
