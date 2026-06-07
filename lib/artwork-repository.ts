import { filterPublishedArtworks, sortArtworks } from './artwork-utils';
import { hasSupabaseConfig } from './config';
import { sampleArtworks } from './sample-data';
import { createSupabaseServerClient } from './supabase-client';
import { mapSupabaseArtwork, type SupabaseArtworkRow } from './supabase-mapper';
import type { ArtworkWithTranslation } from './types';

const artworkSelect = `
  id,
  slug,
  artist_name,
  section_id,
  year,
  medium,
  dimensions,
  location,
  image_url,
  display_order,
  is_published,
  created_by,
  updated_by,
  created_at,
  updated_at,
  artwork_translations (
    locale,
    title,
    summary,
    body,
    artist_note
  )
`;

export async function getPublishedArtworks(): Promise<ArtworkWithTranslation[]> {
  if (!hasSupabaseConfig()) {
    return sortArtworks(filterPublishedArtworks(sampleArtworks));
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('artworks')
    .select(artworkSelect)
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error || !data) {
    return sortArtworks(filterPublishedArtworks(sampleArtworks));
  }

  return sortArtworks((data as SupabaseArtworkRow[]).map(mapSupabaseArtwork));
}

export async function getPublishedArtworkBySlug(slug: string): Promise<ArtworkWithTranslation | null> {
  if (!hasSupabaseConfig()) {
    return filterPublishedArtworks(sampleArtworks).find((artwork) => artwork.slug === slug) ?? null;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('artworks')
    .select(artworkSelect)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapSupabaseArtwork(data as SupabaseArtworkRow);
}
