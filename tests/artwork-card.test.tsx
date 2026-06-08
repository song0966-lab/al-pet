import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ArtworkCard } from '@/components/artwork-card';
import type { ArtworkWithTranslation } from '@/lib/types';

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  )
}));

const artwork: ArtworkWithTranslation = {
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
    summary: 'This summary belongs on the detail page only.',
    body: 'Longer detail page text.',
    artistNote: 'Artist note text.'
  }
};

describe('ArtworkCard', () => {
  it('shows catalog facts without the detail-page summary', () => {
    render(<ArtworkCard artwork={artwork} />);

    expect(screen.getByRole('link', { name: /Slow Light/ })).toHaveAttribute('href', '/artworks/slow-light');
    expect(screen.getByRole('img', { name: 'Slow Light' })).toBeInTheDocument();
    expect(screen.getByText('A-01')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Slow Light' })).toBeInTheDocument();
    expect(screen.getByText('Kim Seoyeon')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.getByText('Acrylic on canvas')).toBeInTheDocument();
    expect(screen.getByText('100 x 70 cm')).toBeInTheDocument();
    expect(screen.queryByText('This summary belongs on the detail page only.')).not.toBeInTheDocument();
  });
});
