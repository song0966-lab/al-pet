import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { GalleryCatalog } from '@/components/public/gallery-catalog';
import type { ArtworkWithTranslation, Section } from '@/lib/types';

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  )
}));

vi.mock('@/lib/config', () => ({
  hasSupabaseConfig: () => true
}));

const artworks: ArtworkWithTranslation[] = [
  {
    id: 'artwork-1',
    slug: 'slow-light',
    sectionId: 'section-light',
    artistName: 'Kim Seoyeon',
    year: 2026,
    medium: 'Acrylic on canvas',
    dimensions: '100 x 70 cm',
    location: 'A-01',
    imageUrl: 'https://example.com/slow-light.jpg',
    displayOrder: 10,
    isPublished: true,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: 'Slow Light',
      summary: 'Detail page summary.',
      body: 'Detail page body.',
      artistNote: 'Artist note.'
    }
  },
  {
    id: 'artwork-2',
    slug: 'blue-room',
    sectionId: 'section-room',
    artistName: 'Lee Dohyun',
    year: 2025,
    medium: 'Mixed media',
    dimensions: '80 x 90 cm',
    location: 'A-02',
    imageUrl: 'https://example.com/blue-room.jpg',
    displayOrder: 20,
    isPublished: true,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: 'Blue Room',
      summary: 'Detail page summary.',
      body: 'Detail page body.',
      artistNote: 'Artist note.'
    }
  }
];

const sections: Section[] = [
  { id: 'section-light', title: '빛의 이동', description: '빛의 흐름', displayOrder: 10 },
  { id: 'section-room', title: '기억의 방', description: '기억의 공간', displayOrder: 20 },
  { id: 'section-installation', title: '설치 작업', description: '설치 작품', displayOrder: 30 },
  { id: 'section-painting', title: '회화', description: '회화 작품', displayOrder: 40 },
  { id: 'section-drawing', title: '드로잉', description: '드로잉 작품', displayOrder: 50 }
];

describe('GalleryCatalog', () => {
  it('keeps search fixed above wrapping categories and presents artworks in a two-column catalog grid', () => {
    render(<GalleryCatalog initialArtworks={artworks} initialSections={sections} />);

    const title = screen.getByRole('heading', { name: '작품 목록' });
    const search = screen.getByPlaceholderText('작품명, 작가명, 재료 검색');
    const categories = screen.getByLabelText('작품 카테고리');
    const cardGrid = screen.getByLabelText('작품 카드 목록');

    expect(title.compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(categories).toHaveClass('md:flex-wrap');
    expect(categories).toHaveClass('md:overflow-visible');
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true');
    expect(cardGrid).toHaveClass('grid');
    expect(cardGrid).toHaveClass('md:grid-cols-2');
    expect(within(cardGrid).getAllByRole('link')).toHaveLength(2);
  });
});
