import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AdminShell } from '@/components/admin/admin-shell';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn()
  })
}));

describe('AdminShell', () => {
  it('keeps logout inside a compact admin account menu', () => {
    render(
      <AdminShell session={{ email: 'curator@example.com', mode: 'demo' }}>
        <p>Admin content</p>
      </AdminShell>
    );

    expect(screen.getByRole('link', { name: /관리자 홈/ })).toHaveAttribute('href', '/admin');
    expect(screen.getByRole('link', { name: /작품 관리/ })).toHaveAttribute('href', '/admin/artworks');
    expect(screen.getByRole('link', { name: /전시 안내/ })).toHaveAttribute('href', '/admin/exhibition');
    expect(screen.getByRole('link', { name: /섹션 관리/ })).toHaveAttribute('href', '/admin/sections');
    expect(screen.getByRole('link', { name: /관람 화면 보기/ })).toHaveAttribute('href', '/');

    expect(screen.queryByText('curator@example.com')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /로그아웃/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /관리자/ }));

    expect(screen.getByRole('button', { name: /로그아웃/ })).toBeInTheDocument();
  });
});
