export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const artworkBucket =
  process.env.NEXT_PUBLIC_SUPABASE_ARTWORK_BUCKET ?? 'artwork-images';

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
