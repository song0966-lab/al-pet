import { hasSupabaseConfig } from './config';
import { sampleExhibition } from './sample-data';
import { createSupabaseServerClient } from './supabase-client';
import { mapSupabaseExhibition, type SupabaseExhibitionRow } from './supabase-mapper';
import type { Exhibition } from './types';

export async function getCurrentExhibition(): Promise<Exhibition> {
  if (!hasSupabaseConfig()) {
    return sampleExhibition;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('exhibitions')
    .select(
      `
        id,
        title,
        subtitle,
        venue,
        starts_at,
        ends_at,
        viewing_hours,
        visitor_notice,
        hero_image_url,
        introduction,
        curator_note,
        is_published,
        created_by,
        updated_by,
        created_at,
        updated_at
      `
    )
    .eq('is_published', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return sampleExhibition;
  }

  return mapSupabaseExhibition(data as SupabaseExhibitionRow);
}
