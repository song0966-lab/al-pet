import { hasSupabaseConfig } from './config';
import { sampleSections } from './sample-data';
import { sortSections } from './section-utils';
import { createSupabaseServerClient } from './supabase-client';
import { mapSupabaseSection, type SupabaseSectionRow } from './supabase-mapper';
import type { Section } from './types';

export async function getSections(): Promise<Section[]> {
  if (!hasSupabaseConfig()) {
    return sortSections(sampleSections);
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('sections')
    .select('id, title, description, display_order')
    .order('display_order', { ascending: true });

  if (error || !data) {
    return sortSections(sampleSections);
  }

  return sortSections((data as SupabaseSectionRow[]).map(mapSupabaseSection));
}
