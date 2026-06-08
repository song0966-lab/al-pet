import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ArtworkDetailClient } from '@/components/public/artwork-detail-client';
import type { ArtworkWithTranslation } from '@/lib/types';

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  )
}));

vi.mock('@/lib/config', () => ({
  hasSupabaseConfig: () => true
}));

const artwork: ArtworkWithTranslation = {
  id: 'artwork-1',
  slug: 'slow-light',
  sectionId: 'section-light',
  artistName: '김서연',
  year: 2026,
  medium: '캔버스에 아크릴',
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
    title: '느린 빛',
    summary: '흰 벽을 따라 이동하는 오후의 색',
    body: '작품 앞에서 잠시 멈추는 시간을 다룹니다.\n빛의 방향을 따라 시선이 움직입니다.',
    artistNote: '빛은 멈춘 것처럼 보여도 조금씩 옮겨갑니다.'
  }
};

describe('ArtworkDetailClient', () => {
  it('presents a mobile-first visitor detail page with existing artwork fields only', () => {
    render(<ArtworkDetailClient initialArtwork={artwork} slug="slow-light" />);

    const backLink = screen.getByRole('link', { name: /작품 목록/ });
    const image = screen.getByRole('img', { name: '느린 빛' });
    const title = screen.getByRole('heading', { name: '느린 빛' });
    const details = screen.getByLabelText('작품 기본 정보');
    const body = screen.getByLabelText('작품 소개');
    const artistNote = screen.getByLabelText('작가 노트');

    expect(backLink).toHaveAttribute('href', '/');
    expect(backLink.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(image.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(screen.getByText('A-01')).toBeInTheDocument();
    expect(screen.getByText('흰 벽을 따라 이동하는 오후의 색')).toBeInTheDocument();
    expect(within(details).getByText('작가')).toBeInTheDocument();
    expect(within(details).getByText('김서연')).toBeInTheDocument();
    expect(within(details).getByText('연도')).toBeInTheDocument();
    expect(within(details).getByText('2026')).toBeInTheDocument();
    expect(within(details).getByText('재료')).toBeInTheDocument();
    expect(within(details).getByText('캔버스에 아크릴')).toBeInTheDocument();
    expect(within(details).getByText('크기')).toBeInTheDocument();
    expect(within(details).getByText('100 x 70 cm')).toBeInTheDocument();

    expect(within(body).getByText('작품 앞에서 잠시 멈추는 시간을 다룹니다.')).toBeInTheDocument();
    expect(within(artistNote).getByText('빛은 멈춘 것처럼 보여도 조금씩 옮겨갑니다.')).toBeInTheDocument();
    expect(screen.queryByText(/QR/)).not.toBeInTheDocument();
    expect(screen.queryByText(/오디오/)).not.toBeInTheDocument();
  });
});
