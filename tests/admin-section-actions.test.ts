import { describe, expect, it } from 'vitest';

import { createSectionInCollection, updateSectionInCollection } from '@/lib/admin-section-actions';
import type { Section, SectionDraft } from '@/lib/types';

const existingSections: Section[] = [
  { id: 'section-light', title: '빛의 이동', description: '빛을 다루는 작품', displayOrder: 10 }
];

const validDraft: SectionDraft = {
  title: '  기억의 방  ',
  description: '  기억을 다루는 작품  ',
  displayOrder: 20
};

describe('admin section actions', () => {
  it('creates a normalized section in display order', () => {
    const result = createSectionInCollection({
      existingSections,
      draft: validDraft,
      id: 'section-memory'
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.section).toEqual({
      id: 'section-memory',
      title: '기억의 방',
      description: '기억을 다루는 작품',
      displayOrder: 20
    });
    expect(result.sections.map((section) => section.id)).toEqual(['section-light', 'section-memory']);
  });

  it('updates an existing section', () => {
    const result = updateSectionInCollection({
      existingSections,
      sectionId: 'section-light',
      draft: {
        title: '빛의 궤도',
        description: '새 설명',
        displayOrder: 5
      }
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.section.title).toBe('빛의 궤도');
    expect(result.sections[0].displayOrder).toBe(5);
  });

  it('rejects an empty section name', () => {
    const result = createSectionInCollection({
      existingSections,
      draft: {
        title: ' ',
        description: '',
        displayOrder: 30
      },
      id: 'section-empty'
    });

    expect(result.success).toBe(false);
  });
});
