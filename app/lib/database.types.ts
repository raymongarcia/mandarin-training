export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      learning_progress: {
        Row: {
          user_id: string;
          progress: Json;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          progress: Json;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          progress?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_activity: {
        Row: {
          user_id: string;
          activity_date: string;
          active_seconds: number;
        };
        Insert: {
          user_id: string;
          activity_date?: string;
          active_seconds: number;
        };
        Update: {
          user_id?: string;
          activity_date?: string;
          active_seconds?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      record_learning_activity: {
        Args: { p_seconds: number };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
