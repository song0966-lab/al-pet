import { normalizeExhibitionDraft, validateExhibitionDraft } from './exhibition-utils';
import type { Exhibition, ExhibitionDraft } from './types';

type ActionFailure = {
  success: false;
  error: ReturnType<typeof validateExhibitionDraft>['error'] | Error;
};

type ActionSuccess = {
  success: true;
  exhibition: Exhibition;
};

export function updateExhibitionDetails(input: {
  currentExhibition: Exhibition;
  draft: ExhibitionDraft;
  userEmail: string;
  now: string;
}): ActionSuccess | ActionFailure {
  const validation = validateExhibitionDraft(input.draft);

  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const normalizedDraft = normalizeExhibitionDraft(validation.data);

  return {
    success: true,
    exhibition: {
      ...input.currentExhibition,
      ...normalizedDraft,
      id: input.currentExhibition.id,
      createdBy: input.currentExhibition.createdBy,
      createdAt: input.currentExhibition.createdAt,
      updatedBy: input.userEmail,
      updatedAt: input.now
    }
  };
}
