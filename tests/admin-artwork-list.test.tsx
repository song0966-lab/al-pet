import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AdminArtworkList } from '@/components/admin/admin-artwork-list';
import type { ArtworkWithTranslation } from '@/lib/types';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
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
    slug: 'light-motion',
    sectionId: 'section-light',
    artistName: '김서연',
    year: 2026,
    medium: '캔버스에 아크릴',
    dimensions: '100 x 70 cm',
    location: '입구 벽면',
    imageUrl: 'https://example.com/light.jpg',
    displayOrder: 1,
    isPublished: true,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '빛의 기동',
      summary: '대표 이미지와 소개문',
      body: '작품 본문',
      artistNote: '작가 노트'
    }
  },
  {
    id: 'artwork-2',
    slug: 'memory-room',
    sectionId: 'section-memory',
    artistName: '이도윤',
    year: 2025,
    medium: '혼합 매체',
    dimensions: '90 x 120 cm',
    location: '중앙 공간',
    imageUrl: 'https://example.com/memory.jpg',
    displayOrder: 2,
    isPublished: false,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '기억의 방',
      summary: '해설 입력 상태',
      body: '작품 본문',
      artistNote: '작가 노트'
    }
  }
];

vi.mock('@/lib/admin-artwork-store', () => ({
  getAdminSession: vi.fn(async () => ({ email: 'curator@example.com', mode: 'demo' })),
  listAdminArtworks: vi.fn(async () => artworks),
  setArtworkPublished: vi.fn()
}));

vi.mock('@/lib/admin-section-store', () => ({
  listAdminSections: vi.fn(async () => [
    {
      id: 'section-light',
      title: '1관',
      description: '빛의 흐름',
      displayOrder: 1
    },
    {
      id: 'section-memory',
      title: '2관',
      description: '기억의 공간',
      displayOrder: 2
    }
  ])
}));

describe('AdminArtworkList', () => {
  it('shows a clearer artwork management table with compact title subtext', async () => {
    render(<AdminArtworkList />);

    expect(await screen.findByRole('heading', { name: '작품 관리' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /작품 추가/ })).toHaveAttribute('href', '/admin/artworks/new');

    expect(screen.getAllByText('작가').length).toBeGreaterThan(0);
    expect(screen.getAllByText('섹션').length).toBeGreaterThan(0);
    expect(screen.getAllByText('위치').length).toBeGreaterThan(0);
    expect(screen.getAllByText('표시 순서').length).toBeGreaterThan(0);
    expect(screen.getAllByText('상태').length).toBeGreaterThan(0);
    expect(screen.getAllByText('관리').length).toBeGreaterThan(0);

    expect(screen.getByText('공개')).toBeInTheDocument();
    expect(screen.getByText('비공개')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: '수정' })).toHaveLength(2);

    const firstStatusCell = screen.getByLabelText('빛의 기동 상태');
    const firstManagementCell = screen.getByLabelText('빛의 기동 관리');
    expect(firstStatusCell).toHaveTextContent('공개');
    const firstStatusText = within(firstStatusCell).getByText('공개');
    const firstStatusToggle = within(firstStatusCell).getByRole('button', { name: '비공개로 전환' });
    expect(firstStatusCell).toHaveClass('flex-col');
    expect(
      firstStatusText.compareDocumentPosition(firstStatusToggle) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(firstManagementCell).toContainElement(screen.getAllByRole('link', { name: '수정' })[0]);
    expect(
      firstStatusCell.compareDocumentPosition(firstManagementCell) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    const subtext = screen.getByText('캔버스에 아크릴 · 100 x 70 cm');
    expect(subtext).toHaveClass('text-xs');
    expect(subtext.className).toContain('text-graphite/60');

    await waitFor(() => expect(replace).not.toHaveBeenCalled());
  });
});
