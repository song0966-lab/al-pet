import { createClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from './config';

export function createSupabaseBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function createSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}
