import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ExhibitionMapPanel } from '@/components/public/exhibition-map-panel';
import { sampleArtworks } from '@/lib/sample-data';

describe('ExhibitionMapPanel', () => {
  it('shows a location-only exhibition map without adding another artwork search', () => {
    render(<ExhibitionMapPanel artworks={sampleArtworks} />);

    const map = screen.getByLabelText('전시장 지도');

    expect(within(map).getByRole('heading', { name: '전시장 지도' })).toBeInTheDocument();
    expect(within(map).getByText('위치 번호는 작품 카드의 위치와 같습니다.')).toBeInTheDocument();
    expect(within(map).queryByRole('textbox')).not.toBeInTheDocument();
    expect(within(map).getByText('A 구역')).toBeInTheDocument();
    expect(within(map).getByText('B 구역')).toBeInTheDocument();
    expect(within(map).getByText('C 구역')).toBeInTheDocument();

    expect(within(map).getByRole('link', { name: 'A-01 느린 빛' })).toHaveAttribute(
      'href',
      '/artworks/slow-light'
    );
    expect(within(map).getByRole('link', { name: 'B-02 숨은 선의 지도' })).toHaveAttribute(
      'href',
      '/artworks/hidden-line-map'
    );
    expect(within(map).queryByText('정원의 색인')).not.toBeInTheDocument();
  });

  it('does not render when there are no published artwork locations', () => {
    render(<ExhibitionMapPanel artworks={sampleArtworks.map((artwork) => ({ ...artwork, isPublished: false }))} />);

    expect(screen.queryByLabelText('전시장 지도')).not.toBeInTheDocument();
  });
});
