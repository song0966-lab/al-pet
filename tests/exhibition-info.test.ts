import { describe, expect, it } from 'vitest';

import { buildExhibitionInfoItems, formatExhibitionDateRange } from '@/lib/exhibition-info';
import { sampleExhibition } from '@/lib/sample-data';

describe('exhibition info', () => {
  it('formats the exhibition date range for visitor guide copy', () => {
    expect(formatExhibitionDateRange('2026-06-01', '2026-06-30')).toBe('2026.06.01 - 2026.06.30');
  });

  it('builds visitor guide items from the current exhibition', () => {
    expect(buildExhibitionInfoItems(sampleExhibition)).toEqual([
      { label: 'Period / 기간', value: '2026.06.01 - 2026.06.30' },
      { label: 'Venue / 장소', value: '화이트룸 갤러리' },
      { label: 'Hours / 관람 시간', value: '10:00 - 18:00' },
      { label: 'Notice / 안내', value: '작품 앞에서 잠시 머물며 천천히 감상해주세요.' }
    ]);
  });
});
