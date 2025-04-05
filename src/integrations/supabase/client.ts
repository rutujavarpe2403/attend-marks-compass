
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';

// Define the database types manually since the generated types are missing tables
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        }
        Insert: {
          id: string;
          name?: string | null;
          role: string;
          created_at?: string;
          updated_at?: string;
        }
        Update: {
          id?: string;
          name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        }
      }
      students: {
        Row: {
          id: string;
          name: string;
          batch: string;
          class_id: string | null;
          board: string;
          created_at: string | null;
        }
        Insert: {
          id?: string;
          name: string;
          batch: string;
          class_id?: string | null;
          board: string;
          created_at?: string | null;
        }
        Update: {
          id?: string;
          name?: string;
          batch?: string;
          class_id?: string | null;
          board?: string;
          created_at?: string | null;
        }
      }
      attendance: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          morning: boolean | null;
          afternoon: boolean | null;
          evening: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        }
        Insert: {
          id?: string;
          student_id: string;
          date: string;
          morning?: boolean | null;
          afternoon?: boolean | null;
          evening?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        }
        Update: {
          id?: string;
          student_id?: string;
          date?: string;
          morning?: boolean | null;
          afternoon?: boolean | null;
          evening?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        }
      }
      marks: {
        Row: {
          id: string;
          student_id: string;
          class_id: string;
          board: string;
          exam_type: string;
          subject_id: string;
          marks: number;
          created_at: string | null;
          updated_at: string | null;
        }
        Insert: {
          id?: string;
          student_id: string;
          class_id: string;
          board: string;
          exam_type: string;
          subject_id: string;
          marks: number;
          created_at?: string | null;
          updated_at?: string | null;
        }
        Update: {
          id?: string;
          student_id?: string;
          class_id?: string;
          board?: string;
          exam_type?: string;
          subject_id?: string;
          marks?: number;
          created_at?: string | null;
          updated_at?: string | null;
        }
      }
    }
  }
}

const SUPABASE_URL = "https://rfqxcxkkrawzmvpdtbnz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcXhjeGtrcmF3em12cGR0Ym56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMDU1NzIsImV4cCI6MjA1ODY4MTU3Mn0.-lpsPhgZUDskFvU8cwN_mJNeTM-0xC8dHsKATiOX9TY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
