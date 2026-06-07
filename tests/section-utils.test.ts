import { describe, expect, it } from 'vitest';

import { filterArtworksBySection, normalizeSectionDraft, sortSections } from '@/lib/section-utils';
import type { ArtworkWithTranslation, Section, SectionDraft } from '@/lib/types';

const sections: Section[] = [
  { id: 'section-memory', title: '기억의 방', description: '기억을 다루는 작품', displayOrder: 20 },
  { id: 'section-light', title: '빛의 이동', description: '빛을 다루는 작품', displayOrder: 10 }
];

const artworks = [
  { id: 'artwork-1', sectionId: 'section-light', displayOrder: 20, translation: { title: '빛 A' } },
  { id: 'artwork-2', sectionId: 'section-memory', displayOrder: 10, translation: { title: '기억 A' } },
  { id: 'artwork-3', sectionId: null, displayOrder: 30, translation: { title: '분류 없음' } }
] as ArtworkWithTranslation[];

describe('section utilities', () => {
  it('sorts sections by display order and title', () => {
    expect(sortSections(sections).map((section) => section.id)).toEqual(['section-light', 'section-memory']);
  });

  it('filters artworks by selected section', () => {
    expect(filterArtworksBySection(artworks, 'section-light').map((artwork) => artwork.id)).toEqual(['artwork-1']);
    expect(filterArtworksBySection(artworks, 'all').map((artwork) => artwork.id)).toEqual([
      'artwork-1',
      'artwork-2',
      'artwork-3'
    ]);
  });

  it('normalizes section drafts before saving', () => {
    const draft: SectionDraft = {
      title: '  새 섹션  ',
      description: '  섹션 설명  ',
      displayOrder: 30
    };

    expect(normalizeSectionDraft(draft)).toEqual({
      title: '새 섹션',
      description: '섹션 설명',
      displayOrder: 30
    });
  });
});
