import { fireEvent, render, screen, within } from '@testing-library/react';
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

const previousArtwork: ArtworkWithTranslation = {
  ...artwork,
  id: 'artwork-previous',
  slug: 'blue-room-study',
  location: 'A-02',
  displayOrder: 5,
  translation: {
    ...artwork.translation,
    title: '푸른 방을 위한 습작'
  }
};

const nextArtwork: ArtworkWithTranslation = {
  ...artwork,
  id: 'artwork-next',
  slug: 'layered-afternoon',
  location: 'A-03',
  displayOrder: 20,
  translation: {
    ...artwork.translation,
    title: '겹쳐진 오후'
  }
};

describe('ArtworkDetailClient', () => {
  it('presents a mobile-first visitor detail page with existing artwork fields only', () => {
    render(<ArtworkDetailClient initialArtwork={artwork} initialArtworks={[artwork]} slug="slow-light" />);

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

  it('places previous and next artwork links after the artist note without duplicating the list link', () => {
    render(
      <ArtworkDetailClient
        initialArtwork={artwork}
        initialArtworks={[artwork, previousArtwork, nextArtwork]}
        slug="slow-light"
      />
    );

    const artistNote = screen.getByLabelText('작가 노트');
    const navigation = screen.getByLabelText('이전 다음 작품');
    const previousLink = within(navigation).getByRole('link', { name: /이전 작품.*푸른 방을 위한 습작/ });
    const nextLink = within(navigation).getByRole('link', { name: /다음 작품.*겹쳐진 오후/ });

    expect(artistNote.compareDocumentPosition(navigation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(previousLink).toHaveAttribute('href', '/artworks/blue-room-study');
    expect(nextLink).toHaveAttribute('href', '/artworks/layered-afternoon');
    expect(screen.getAllByRole('link', { name: /작품 목록/ })).toHaveLength(1);
  });

  it('opens and closes an enlarged image viewer from the artwork image', () => {
    render(<ArtworkDetailClient initialArtwork={artwork} initialArtworks={[artwork]} slug="slow-light" />);

    fireEvent.click(screen.getByRole('button', { name: '작품 이미지 크게 보기' }));

    const dialog = screen.getByRole('dialog', { name: '확대 이미지' });
    expect(within(dialog).getByRole('img', { name: '느린 빛 확대 이미지' })).toHaveAttribute(
      'src',
      'https://example.com/slow-light.jpg'
    );

    fireEvent.click(within(dialog).getByRole('button', { name: '확대 이미지 닫기' }));

    expect(screen.queryByRole('dialog', { name: '확대 이미지' })).not.toBeInTheDocument();
  });
});
