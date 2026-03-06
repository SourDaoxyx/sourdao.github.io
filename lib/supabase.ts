import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Public Supabase credentials (anon key — safe to embed in client-side code).
// env vars override these so local .env.local still works.
// ---------------------------------------------------------------------------
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://vsvqadtwzwrukltksaef.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdnFhZHR3endydWtsdGtzYWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MzgyNzksImV4cCI6MjA4ODMxNDI3OX0.NJFXMJprqA29r3ARlwjCh-StO14-3ylRXEQj40tmSN4";

/** Singleton Supabase client */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
