import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SiteHeader } from '@/components/site-header';

describe('SiteHeader', () => {
  it('labels the visitor home link as home instead of artwork', () => {
    render(<SiteHeader />);

    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', { name: '작품' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '관리자' })).toHaveAttribute('href', '/admin/artworks');
  });
});
