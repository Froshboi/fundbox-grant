import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export async function checkSupabaseConnection(): Promise<string> {
  if (!supabase) return "Supabase is not configured.";
  const { error } = await supabase.auth.getSession();
  if (error) throw error;
  return "Connected to Supabase.";
}
