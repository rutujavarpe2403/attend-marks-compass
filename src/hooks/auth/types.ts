
import { User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  name: string | null;
  role: "teacher" | "student";
  created_at?: string;
  updated_at?: string;
};

export type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
};
