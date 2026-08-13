export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" };
  public: {
    Tables: {
      ask_cache: {
        Row: { age: number; cache_key: string; created_at: string; hits: number; lang: string; last_used_at: string; question: string; response: Json };
        Insert: { age: number; cache_key: string; created_at?: string; hits?: number; lang: string; last_used_at?: string; question: string; response: Json };
        Update: { age?: number; cache_key?: string; created_at?: string; hits?: number; lang?: string; last_used_at?: string; question?: string; response?: Json };
        Relationships: [];
      };
      profiles: {
        Row: { age: number | null; created_at: string; display_name: string | null; id: string; updated_at: string };
        Insert: { age?: number | null; created_at?: string; display_name?: string | null; id: string; updated_at?: string };
        Update: { age?: number | null; created_at?: string; display_name?: string | null; id?: string; updated_at?: string };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
