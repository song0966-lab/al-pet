import { describe, expect, it } from 'vitest';
import {
  createArtworkInCollection,
  toggleArtworkPublication,
  updateArtworkInCollection
} from '@/lib/admin-artwork-actions';
import type { ArtworkDraft, ArtworkWithTranslation } from '@/lib/types';

const baseArtwork: ArtworkWithTranslation = {
  id: 'artwork-1',
  slug: 'first-work',
  artistName: '한유진',
  year: 2026,
  medium: '아카이벌 프린트',
  dimensions: '100 x 70 cm',
  location: 'Gallery 1',
  imageUrl: 'https://example.com/first.jpg',
  displayOrder: 1,
  isPublished: false,
  createdBy: 'curator@example.com',
  updatedBy: 'curator@example.com',
  createdAt: '2026-05-29T00:00:00.000Z',
  updatedAt: '2026-05-29T00:00:00.000Z',
  translation: {
    locale: 'ko',
    title: '첫 번째 작품',
    summary: '전시의 시작점',
    body: '공간에 들어서는 순간의 감각을 다룬다.',
    artistNote: ''
  }
};

const draft: ArtworkDraft = {
  slug: 'second-work',
  artistName: '정민서',
  year: 2026,
  medium: '캔버스에 아크릴',
  dimensions: '80 x 80 cm',
  location: 'Gallery 2',
  imageUrl: 'https://example.com/second.jpg',
  displayOrder: 2,
  isPublished: true,
  translation: {
    locale: 'ko',
    title: '두 번째 작품',
    summary: '밝은 리듬',
    body: '반복되는 색과 선으로 속도를 만든다.',
    artistNote: '천천히 보아야 보이는 리듬을 남겼습니다.'
  }
};

describe('admin artwork actions', () => {
  it('creates a normalized artwork with audit fields', () => {
    const result = createArtworkInCollection({
      existingArtworks: [baseArtwork],
      draft,
      userEmail: 'curator@example.com',
      now: '2026-05-29T01:00:00.000Z',
      id: 'artwork-2'
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.artwork).toMatchObject({
      id: 'artwork-2',
      slug: 'second-work',
      isPublished: true,
      createdBy: 'curator@example.com',
      updatedBy: 'curator@example.com',
      createdAt: '2026-05-29T01:00:00.000Z',
      updatedAt: '2026-05-29T01:00:00.000Z'
    });
    expect(result.artworks.map((artwork) => artwork.slug)).toEqual(['first-work', 'second-work']);
  });

  it('updates an existing artwork without changing creation audit fields', () => {
    const result = updateArtworkInCollection({
      existingArtworks: [baseArtwork],
      artworkId: 'artwork-1',
      draft: {
        ...draft,
        slug: 'renamed-work'
      },
      userEmail: 'editor@example.com',
      now: '2026-05-29T02:00:00.000Z'
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.artwork).toMatchObject({
      id: 'artwork-1',
      slug: 'renamed-work',
      createdBy: 'curator@example.com',
      updatedBy: 'editor@example.com',
      createdAt: '2026-05-29T00:00:00.000Z',
      updatedAt: '2026-05-29T02:00:00.000Z'
    });
  });

  it('toggles publication state for an artwork', () => {
    const result = toggleArtworkPublication({
      existingArtworks: [baseArtwork],
      artworkId: 'artwork-1',
      isPublished: true,
      userEmail: 'curator@example.com',
      now: '2026-05-29T03:00:00.000Z'
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.artwork.isPublished).toBe(true);
    expect(result.artwork.updatedAt).toBe('2026-05-29T03:00:00.000Z');
  });
});
