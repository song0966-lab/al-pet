import { describe, expect, it } from 'vitest';
import {
  filterPublishedArtworks,
  searchArtworks,
  sortArtworks,
  validateArtworkDraft
} from '@/lib/artwork-utils';
import type { ArtworkWithTranslation } from '@/lib/types';

const artworks: ArtworkWithTranslation[] = [
  {
    id: '2',
    slug: 'quiet-window',
    artistName: '김서연',
    year: 2025,
    medium: '캔버스에 유채',
    dimensions: '90 x 120 cm',
    location: 'A-02',
    imageUrl: '/images/window.jpg',
    displayOrder: 20,
    isPublished: true,
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '조용한 창',
      summary: '빛이 천천히 이동하는 오후의 장면',
      body: '흰 벽 위로 움직이는 빛의 방향을 따라 시선이 흐른다.',
      artistNote: '가장 작은 변화가 풍경을 바꿉니다.'
    }
  },
  {
    id: '1',
    slug: 'blue-room',
    artistName: '이도현',
    year: 2024,
    medium: '혼합 매체',
    dimensions: '60 x 80 cm',
    location: 'A-01',
    imageUrl: '/images/room.jpg',
    displayOrder: 10,
    isPublished: false,
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '푸른 방',
      summary: '닫힌 방에 남은 색의 잔상',
      body: '공간의 온도와 기억을 색면으로 압축한다.',
      artistNote: '파란색은 이곳에서 시간의 무게입니다.'
    }
  }
];

describe('artwork collection helpers', () => {
  it('shows only published artworks to visitors', () => {
    expect(filterPublishedArtworks(artworks).map((artwork) => artwork.slug)).toEqual([
      'quiet-window'
    ]);
  });

  it('sorts artworks by display order and then title', () => {
    const sorted = sortArtworks(artworks);

    expect(sorted.map((artwork) => artwork.slug)).toEqual(['blue-room', 'quiet-window']);
  });

  it('searches Korean titles and artist names case-insensitively', () => {
    expect(searchArtworks(artworks, '서연').map((artwork) => artwork.slug)).toEqual([
      'quiet-window'
    ]);
    expect(searchArtworks(artworks, 'BLUE')).toEqual([]);
  });
});

describe('artwork draft validation', () => {
  it('rejects a duplicate slug', () => {
    const result = validateArtworkDraft(
      {
        slug: 'quiet-window',
        artistName: '박하나',
        year: 2026,
        medium: '종이에 잉크',
        dimensions: '30 x 40 cm',
        location: 'B-01',
        imageUrl: 'https://example.com/art.jpg',
        displayOrder: 30,
        isPublished: true,
        translation: {
          locale: 'ko',
          title: '새 작품',
          summary: '새로운 작품 요약',
          body: '새로운 작품 본문',
          artistNote: ''
        }
      },
      artworks
    );

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.slug).toContain('이미 사용 중인 주소입니다.');
  });

  it('requires title, slug, artist, image, and body text', () => {
    const result = validateArtworkDraft(
      {
        slug: '',
        artistName: '',
        year: 2026,
        medium: '',
        dimensions: '',
        location: '',
        imageUrl: '',
        displayOrder: 30,
        isPublished: false,
        translation: {
          locale: 'ko',
          title: '',
          summary: '',
          body: '',
          artistNote: ''
        }
      },
      artworks
    );

    expect(result.success).toBe(false);
    const fieldErrors = result.error?.flatten().fieldErrors as Record<string, string[]>;
    expect(fieldErrors.slug).toContain('작품 주소를 입력하세요.');
    expect(fieldErrors.artistName).toContain('작가명을 입력하세요.');
    expect(fieldErrors.imageUrl).toContain('대표 이미지를 추가하세요.');
    expect(fieldErrors['translation.title']).toContain('작품 제목을 입력하세요.');
    expect(fieldErrors['translation.body']).toContain('작품 소개 본문을 입력하세요.');
  });
});
