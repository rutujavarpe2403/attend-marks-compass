// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rfqxcxkkrawzmvpdtbnz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcXhjeGtrcmF3em12cGR0Ym56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMDU1NzIsImV4cCI6MjA1ODY4MTU3Mn0.-lpsPhgZUDskFvU8cwN_mJNeTM-0xC8dHsKATiOX9TY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);