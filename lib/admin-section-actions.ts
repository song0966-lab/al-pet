import { normalizeSectionDraft, sortSections, validateSectionDraft } from './section-utils';
import type { Section, SectionDraft } from './types';

type ActionFailure = {
  success: false;
  error: ReturnType<typeof validateSectionDraft>['error'] | Error;
};

type ActionSuccess = {
  success: true;
  section: Section;
  sections: Section[];
};

export function createSectionInCollection(input: {
  existingSections: Section[];
  draft: SectionDraft;
  id?: string;
}): ActionSuccess | ActionFailure {
  const validation = validateSectionDraft(input.draft);

  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const normalizedDraft = normalizeSectionDraft(validation.data);
  const section: Section = {
    id: input.id ?? crypto.randomUUID(),
    ...normalizedDraft
  };

  return {
    success: true,
    section,
    sections: sortSections([...input.existingSections, section])
  };
}

export function updateSectionInCollection(input: {
  existingSections: Section[];
  sectionId: string;
  draft: SectionDraft;
}): ActionSuccess | ActionFailure {
  const currentSection = input.existingSections.find((section) => section.id === input.sectionId);

  if (!currentSection) {
    return { success: false, error: new Error('Section not found / 섹션을 찾을 수 없습니다.') };
  }

  const validation = validateSectionDraft(input.draft);

  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const section: Section = {
    ...currentSection,
    ...normalizeSectionDraft(validation.data)
  };

  return {
    success: true,
    section,
    sections: sortSections(
      input.existingSections.map((existingSection) =>
        existingSection.id === input.sectionId ? section : existingSection
      )
    )
  };
}
