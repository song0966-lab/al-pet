import { z } from 'zod';
import type { ArtworkWithTranslation, Section, SectionDraft } from './types';

const sectionDraftShape = z.object({
  title: z.string(),
  description: z.string(),
  displayOrder: z.coerce.number().int().min(0, 'Order must be 0 or higher / 표시 순서는 0 이상이어야 합니다.')
});

export function sortSections<T extends Section>(sections: T[]): T[] {
  return [...sections].sort((left, right) => {
    if (left.displayOrder !== right.displayOrder) {
      return left.displayOrder - right.displayOrder;
    }

    return left.title.localeCompare(right.title, 'ko');
  });
}

export function filterArtworksBySection<T extends ArtworkWithTranslation>(
  artworks: T[],
  sectionId: string
): T[] {
  if (sectionId === 'all') {
    return artworks;
  }

  return artworks.filter((artwork) => artwork.sectionId === sectionId);
}

export function validateSectionDraft(draft: SectionDraft) {
  return sectionDraftShape
    .superRefine((value, context) => {
      if (!value.title.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['title'],
          message: 'Enter a section name / 섹션 이름을 입력하세요.'
        });
      }
    })
    .safeParse(draft);
}

export function normalizeSectionDraft(draft: SectionDraft): SectionDraft {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    displayOrder: draft.displayOrder
  };
}
