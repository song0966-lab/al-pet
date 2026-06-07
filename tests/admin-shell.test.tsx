import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AdminShell } from '@/components/admin/admin-shell';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn()
  })
}));

describe('AdminShell', () => {
  it('uses a Korean-only brand and places the account menu after the navigation', () => {
    render(
      <AdminShell session={{ email: 'curator@example.com', mode: 'demo' }}>
        <p>Admin content</p>
      </AdminShell>
    );

    expect(screen.getByRole('link', { name: '전시 관리자' })).toHaveAttribute('href', '/admin');
    expect(screen.queryByText(/Exhibition Admin/)).not.toBeInTheDocument();

    expect(screen.getByRole('link', { name: /관리자 홈/ })).toHaveAttribute('href', '/admin');
    expect(screen.getByRole('link', { name: /작품 관리/ })).toHaveAttribute('href', '/admin/artworks');
    expect(screen.getByRole('link', { name: /전시 안내/ })).toHaveAttribute('href', '/admin/exhibition');
    expect(screen.getByRole('link', { name: /섹션 관리/ })).toHaveAttribute('href', '/admin/sections');
    expect(screen.getByRole('link', { name: /관람 화면 보기/ })).toHaveAttribute('href', '/');

    const nav = screen.getByRole('navigation', { name: '관리자 메뉴' });
    const accountButton = screen.getByRole('button', { name: '관리자' });
    expect(nav.compareDocumentPosition(accountButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(screen.queryByText('curator@example.com')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /로그아웃/ })).not.toBeInTheDocument();

    fireEvent.click(accountButton);

    expect(screen.getByRole('button', { name: /로그아웃/ })).toBeInTheDocument();
  });
});
