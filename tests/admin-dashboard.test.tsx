import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import type { ArtworkWithTranslation } from '@/lib/types';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace
  })
}));

const artworks: ArtworkWithTranslation[] = [
  {
    id: 'artwork-1',
    slug: 'slow-light',
    sectionId: 'section-light',
    artistName: '김서연',
    year: 2026,
    medium: '캔버스에 유채',
    dimensions: '90 x 120 cm',
    location: 'A-01',
    imageUrl: 'https://example.com/slow-light.jpg',
    displayOrder: 10,
    isPublished: true,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '느린 빛',
      summary: '요약',
      body: '본문',
      artistNote: '작가 노트'
    }
  },
  {
    id: 'artwork-2',
    slug: 'blue-room-study',
    sectionId: 'section-memory',
    artistName: '이도현',
    year: 2025,
    medium: '혼합 매체',
    dimensions: '60 x 80 cm',
    location: 'A-02',
    imageUrl: 'https://example.com/blue-room.jpg',
    displayOrder: 20,
    isPublished: false,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-05T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '푸른 방을 위한 습작',
      summary: '요약',
      body: '본문',
      artistNote: '작가 노트'
    }
  }
];

vi.mock('@/lib/admin-artwork-store', () => ({
  getAdminSession: vi.fn(async () => ({ email: 'curator@example.com', mode: 'demo' })),
  listAdminArtworks: vi.fn(async () => artworks),
  signOutAdmin: vi.fn()
}));

vi.mock('@/lib/admin-section-store', () => ({
  listAdminSections: vi.fn(async () => [
    { id: 'section-light', title: '빛의 이동', description: '빛의 흐름', displayOrder: 10 },
    { id: 'section-memory', title: '기억의 방', description: '기억의 공간', displayOrder: 20 }
  ])
}));

describe('AdminDashboard', () => {
  it('summarizes exhibition management status and keeps key actions easy to reach', async () => {
    render(<AdminDashboard />);

    expect(await screen.findByRole('heading', { name: '관리자 홈' })).toBeInTheDocument();

    const summary = screen.getByLabelText('관리 요약');
    expect(within(summary).getByLabelText('전체 작품')).toHaveTextContent('2');
    expect(within(summary).getByLabelText('공개 작품')).toHaveTextContent('1');
    expect(within(summary).getByLabelText('비공개 작품')).toHaveTextContent('1');
    expect(within(summary).getByLabelText('섹션')).toHaveTextContent('2');

    const quickActions = screen.getByLabelText('바로 확인하기');
    expect(within(quickActions).getByRole('link', { name: '비공개 작품 확인' })).toHaveAttribute(
      'href',
      '/admin/artworks'
    );
    expect(within(quickActions).getByRole('link', { name: '작품 추가' })).toHaveAttribute(
      'href',
      '/admin/artworks/new'
    );
    expect(within(quickActions).getByRole('link', { name: '관람 화면 보기' })).toHaveAttribute('href', '/');

    const recent = screen.getByLabelText('최근 수정된 작품');
    expect(within(recent).getByText('푸른 방을 위한 습작')).toBeInTheDocument();
    expect(within(recent).getByText('A-02 · 비공개')).toBeInTheDocument();
    expect(within(recent).getByText('느린 빛')).toBeInTheDocument();
    expect(within(recent).getByText('A-01 · 공개')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
