import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ArtworkEditor } from '@/components/admin/artwork-editor';
import type { ArtworkWithTranslation } from '@/lib/types';

const push = vi.fn();
const refresh = vi.fn();
const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
    refresh,
    replace
  })
}));

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  )
}));

const artworks: ArtworkWithTranslation[] = [
  {
    id: 'artwork-1',
    slug: 'slow-light',
    sectionId: 'section-light',
    artistName: '김서연',
    year: 2026,
    medium: '캔버스에 아크릴',
    dimensions: '100 x 70 cm',
    location: '입구 벽면',
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
      body: '작품 소개 본문',
      artistNote: '작가 노트'
    }
  }
];

vi.mock('@/lib/admin-artwork-store', () => ({
  getAdminSession: vi.fn(async () => ({ email: 'curator@example.com', mode: 'demo' })),
  listAdminArtworks: vi.fn(async () => artworks),
  saveArtwork: vi.fn(),
  signOutAdmin: vi.fn(),
  uploadArtworkImage: vi.fn()
}));

vi.mock('@/lib/admin-section-store', () => ({
  listAdminSections: vi.fn(async () => [
    {
      id: 'section-light',
      title: '빛의 이동',
      description: '빛의 흐름',
      displayOrder: 10
    }
  ])
}));

describe('ArtworkEditor', () => {
  it('places the representative image before the basic information form', async () => {
    render(<ArtworkEditor artworkId="artwork-1" />);

    expect(await screen.findByRole('heading', { name: 'Edit Artwork / 작품 수정' })).toBeInTheDocument();

    const imagePanel = screen.getByLabelText('대표 이미지');
    const infoPanel = screen.getByLabelText('기본 정보');

    expect(imagePanel.compareDocumentPosition(infoPanel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(imagePanel).getByText('대표 이미지')).toBeInTheDocument();
    expect(within(imagePanel).getByRole('img', { name: '느린 빛' })).toHaveAttribute(
      'src',
      'https://example.com/slow-light.jpg'
    );

    expect(within(infoPanel).getByText('기본 정보')).toBeInTheDocument();
    expect(within(infoPanel).getByLabelText('Title / 작품 제목')).toHaveValue('느린 빛');
    expect(within(infoPanel).getByLabelText('Artist / 작가명')).toHaveValue('김서연');
    expect(within(infoPanel).getByLabelText('Body / 작품 소개 본문')).toHaveValue('작품 소개 본문');
    expect(screen.queryByText('작품 해설')).not.toBeInTheDocument();

    await waitFor(() => expect(replace).not.toHaveBeenCalled());
  });
});
