import { describe, expect, it } from 'vitest';

import { sampleArtworks } from '@/lib/sample-data';
import { filterPublishedArtworks } from '@/lib/artwork-utils';

describe('sample artwork data', () => {
  it('provides enough published temporary artworks for the public two-column catalog', () => {
    const publishedArtworks = filterPublishedArtworks(sampleArtworks);

    expect(publishedArtworks).toHaveLength(6);
    expect(publishedArtworks.map((artwork) => artwork.translation.title)).toEqual([
      '느린 빛',
      '푸른 방을 위한 습작',
      '겹쳐진 오후',
      '숨은 선의 지도',
      '유리 표면의 기억',
      '낮은 정원'
    ]);
  });

  it('keeps temporary artwork slugs unique', () => {
    const slugs = sampleArtworks.map((artwork) => artwork.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
