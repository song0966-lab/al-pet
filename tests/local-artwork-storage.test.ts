import { describe, expect, it, beforeEach } from 'vitest';

import { LOCAL_ARTWORKS_KEY, readLocalArtworks } from '@/lib/local-artwork-storage';
import { sampleArtworks } from '@/lib/sample-data';

describe('local artwork storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('keeps existing browser artworks and backfills newly added temporary samples', () => {
    const customizedExistingArtwork = {
      ...sampleArtworks[0],
      translation: {
        ...sampleArtworks[0].translation,
        title: '내가 바꾼 느린 빛'
      }
    };
    const userAddedArtwork = {
      ...sampleArtworks[1],
      id: 'user-added-artwork',
      slug: 'user-added-artwork',
      displayOrder: 999,
      translation: {
        ...sampleArtworks[1].translation,
        title: '직접 추가한 작품'
      }
    };

    window.localStorage.setItem(
      LOCAL_ARTWORKS_KEY,
      JSON.stringify([customizedExistingArtwork, userAddedArtwork])
    );

    const artworks = readLocalArtworks();
    const storedArtworks = JSON.parse(
      window.localStorage.getItem(LOCAL_ARTWORKS_KEY) ?? '[]'
    ) as typeof sampleArtworks;

    expect(artworks.map((artwork) => artwork.id)).toEqual(
      expect.arrayContaining(sampleArtworks.map((artwork) => artwork.id))
    );
    expect(artworks.find((artwork) => artwork.id === sampleArtworks[0].id)?.translation.title).toBe(
      '내가 바꾼 느린 빛'
    );
    expect(artworks.find((artwork) => artwork.id === userAddedArtwork.id)?.translation.title).toBe(
      '직접 추가한 작품'
    );
    expect(storedArtworks.map((artwork) => artwork.id)).toEqual(
      expect.arrayContaining(sampleArtworks.map((artwork) => artwork.id))
    );
  });
});
