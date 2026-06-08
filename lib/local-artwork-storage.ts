import { sortArtworks } from './artwork-utils';
import { withExhibitionGuideDefaults } from './exhibition-info';
import { sampleArtworks, sampleExhibition, sampleSections } from './sample-data';
import { sortSections } from './section-utils';
import type { ArtworkWithTranslation, Exhibition, Section } from './types';

export const LOCAL_ARTWORKS_KEY = 'exhibition-catalog-artworks';
export const LOCAL_EXHIBITION_KEY = 'exhibition-catalog-exhibition';
export const LOCAL_SECTIONS_KEY = 'exhibition-catalog-sections';
export const LOCAL_ADMIN_SESSION_KEY = 'exhibition-catalog-admin-session';

export function readLocalArtworks(): ArtworkWithTranslation[] {
  if (typeof window === 'undefined') {
    return sampleArtworks;
  }

  const storedValue = window.localStorage.getItem(LOCAL_ARTWORKS_KEY);

  if (!storedValue) {
    writeLocalArtworks(sampleArtworks);
    return sampleArtworks;
  }

  try {
    const parsed = JSON.parse(storedValue) as ArtworkWithTranslation[];
    const artworks = backfillSampleArtworks(parsed);
    if (artworks.length !== parsed.length) {
      writeLocalArtworks(artworks);
    }
    return sortArtworks(artworks);
  } catch {
    writeLocalArtworks(sampleArtworks);
    return sampleArtworks;
  }
}

export function writeLocalArtworks(artworks: ArtworkWithTranslation[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LOCAL_ARTWORKS_KEY, JSON.stringify(sortArtworks(artworks)));
}

export function readLocalExhibition(): Exhibition {
  if (typeof window === 'undefined') {
    return sampleExhibition;
  }

  const storedValue = window.localStorage.getItem(LOCAL_EXHIBITION_KEY);

  if (!storedValue) {
    writeLocalExhibition(sampleExhibition);
    return sampleExhibition;
  }

  try {
    return withExhibitionGuideDefaults(JSON.parse(storedValue) as Exhibition);
  } catch {
    writeLocalExhibition(sampleExhibition);
    return sampleExhibition;
  }
}

export function writeLocalExhibition(exhibition: Exhibition) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LOCAL_EXHIBITION_KEY, JSON.stringify(exhibition));
}

export function readLocalSections(): Section[] {
  if (typeof window === 'undefined') {
    return sampleSections;
  }

  const storedValue = window.localStorage.getItem(LOCAL_SECTIONS_KEY);

  if (!storedValue) {
    writeLocalSections(sampleSections);
    return sampleSections;
  }

  try {
    return sortSections(JSON.parse(storedValue) as Section[]);
  } catch {
    writeLocalSections(sampleSections);
    return sampleSections;
  }
}

export function writeLocalSections(sections: Section[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LOCAL_SECTIONS_KEY, JSON.stringify(sortSections(sections)));
}

function backfillSampleArtworks(artworks: ArtworkWithTranslation[]) {
  const existingIds = new Set(artworks.map((artwork) => artwork.id));
  const missingSampleArtworks = sampleArtworks.filter((artwork) => !existingIds.has(artwork.id));

  if (missingSampleArtworks.length === 0) {
    return artworks;
  }

  return [...artworks, ...missingSampleArtworks];
}
