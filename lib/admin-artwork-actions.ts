import { normalizeArtworkDraft, sortArtworks, validateArtworkDraft } from './artwork-utils';
import type { ArtworkDraft, ArtworkWithTranslation } from './types';

type ActionFailure = {
  success: false;
  error: ReturnType<typeof validateArtworkDraft>['error'] | Error;
};

type ActionSuccess = {
  success: true;
  artwork: ArtworkWithTranslation;
  artworks: ArtworkWithTranslation[];
};

type CreateInput = {
  existingArtworks: ArtworkWithTranslation[];
  draft: ArtworkDraft;
  userEmail: string;
  now: string;
  id?: string;
};

type UpdateInput = {
  existingArtworks: ArtworkWithTranslation[];
  artworkId: string;
  draft: ArtworkDraft;
  userEmail: string;
  now: string;
};

type ToggleInput = {
  existingArtworks: ArtworkWithTranslation[];
  artworkId: string;
  isPublished: boolean;
  userEmail: string;
  now: string;
};

export function createArtworkInCollection(input: CreateInput): ActionSuccess | ActionFailure {
  const validation = validateArtworkDraft(input.draft, input.existingArtworks);

  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const normalizedDraft = normalizeArtworkDraft(validation.data);
  const artwork: ArtworkWithTranslation = {
    ...normalizedDraft,
    id: input.id ?? crypto.randomUUID(),
    createdBy: input.userEmail,
    updatedBy: input.userEmail,
    createdAt: input.now,
    updatedAt: input.now
  };

  return {
    success: true,
    artwork,
    artworks: sortArtworks([...input.existingArtworks, artwork])
  };
}

export function updateArtworkInCollection(input: UpdateInput): ActionSuccess | ActionFailure {
  const currentArtwork = input.existingArtworks.find((artwork) => artwork.id === input.artworkId);

  if (!currentArtwork) {
    return { success: false, error: new Error('작품을 찾을 수 없습니다.') };
  }

  const validation = validateArtworkDraft(input.draft, input.existingArtworks, input.artworkId);

  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const normalizedDraft = normalizeArtworkDraft(validation.data);
  const artwork: ArtworkWithTranslation = {
    ...currentArtwork,
    ...normalizedDraft,
    id: currentArtwork.id,
    createdBy: currentArtwork.createdBy,
    createdAt: currentArtwork.createdAt,
    updatedBy: input.userEmail,
    updatedAt: input.now
  };

  return {
    success: true,
    artwork,
    artworks: sortArtworks(
      input.existingArtworks.map((existingArtwork) =>
        existingArtwork.id === input.artworkId ? artwork : existingArtwork
      )
    )
  };
}

export function toggleArtworkPublication(input: ToggleInput): ActionSuccess | ActionFailure {
  const currentArtwork = input.existingArtworks.find((artwork) => artwork.id === input.artworkId);

  if (!currentArtwork) {
    return { success: false, error: new Error('작품을 찾을 수 없습니다.') };
  }

  const artwork: ArtworkWithTranslation = {
    ...currentArtwork,
    isPublished: input.isPublished,
    updatedBy: input.userEmail,
    updatedAt: input.now
  };

  return {
    success: true,
    artwork,
    artworks: sortArtworks(
      input.existingArtworks.map((existingArtwork) =>
        existingArtwork.id === input.artworkId ? artwork : existingArtwork
      )
    )
  };
}
