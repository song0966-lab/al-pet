import { sortArtworks } from './artwork-utils';
import { withExhibitionGuideDefaults } from './exhibition-info';
import { sampleArtworks, sampleExhibition } from './sample-data';
import type { ArtworkWithTranslation, Exhibition } from './types';

export const LOCAL_ARTWORKS_KEY = 'exhibition-catalog-artworks';
export const LOCAL_EXHIBITION_KEY = 'exhibition-catalog-exhibition';
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
    return sortArtworks(parsed);
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
