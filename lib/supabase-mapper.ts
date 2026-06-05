import type { ArtworkTranslation, ArtworkWithTranslation } from './types';

type SupabaseTranslationRow = {
  locale: string;
  title: string;
  summary: string | null;
  body: string;
  artist_note: string | null;
};

export type SupabaseArtworkRow = {
  id: string;
  slug: string;
  artist_name: string;
  year: number;
  medium: string | null;
  dimensions: string | null;
  location: string | null;
  image_url: string;
  display_order: number;
  is_published: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  artwork_translations?: SupabaseTranslationRow[] | SupabaseTranslationRow | null;
};

export function mapSupabaseArtwork(row: SupabaseArtworkRow): ArtworkWithTranslation {
  const translations = Array.isArray(row.artwork_translations)
    ? row.artwork_translations
    : row.artwork_translations
      ? [row.artwork_translations]
      : [];
  const translationRow = translations.find((translation) => translation.locale === 'ko');
  const translation: ArtworkTranslation = {
    locale: 'ko',
    title: translationRow?.title ?? '제목 없음',
    summary: translationRow?.summary ?? '',
    body: translationRow?.body ?? '',
    artistNote: translationRow?.artist_note ?? ''
  };

  return {
    id: row.id,
    slug: row.slug,
    artistName: row.artist_name,
    year: row.year,
    medium: row.medium ?? '',
    dimensions: row.dimensions ?? '',
    location: row.location ?? '',
    imageUrl: row.image_url,
    displayOrder: row.display_order,
    isPublished: row.is_published,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    translation
  };
}
