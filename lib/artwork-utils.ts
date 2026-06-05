import { z } from 'zod';
import type { ArtworkDraft, ArtworkWithTranslation } from './types';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const artworkDraftShape = z.object({
  slug: z.string(),
  artistName: z.string(),
  year: z.coerce.number().int().min(1900, '제작 연도를 확인하세요.').max(2100, '제작 연도를 확인하세요.'),
  medium: z.string(),
  dimensions: z.string(),
  location: z.string(),
  imageUrl: z.string(),
  displayOrder: z.coerce.number().int().min(0, '표시 순서는 0 이상이어야 합니다.'),
  isPublished: z.boolean(),
  translation: z.object({
    locale: z.literal('ko'),
    title: z.string(),
    summary: z.string(),
    body: z.string(),
    artistNote: z.string()
  })
});

export function sortArtworks<T extends ArtworkWithTranslation>(artworks: T[]): T[] {
  return [...artworks].sort((left, right) => {
    if (left.displayOrder !== right.displayOrder) {
      return left.displayOrder - right.displayOrder;
    }

    return left.translation.title.localeCompare(right.translation.title, 'ko');
  });
}

export function filterPublishedArtworks<T extends ArtworkWithTranslation>(artworks: T[]): T[] {
  return artworks.filter((artwork) => artwork.isPublished);
}

export function searchArtworks<T extends ArtworkWithTranslation>(artworks: T[], query: string): T[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return artworks;
  }

  return artworks.filter((artwork) => {
    const searchableText = normalizeSearchText(
      [
        artwork.translation.title,
        artwork.translation.summary,
        artwork.translation.body,
        artwork.artistName,
        artwork.medium,
        artwork.location
      ].join(' ')
    );

    return searchableText.includes(normalizedQuery);
  });
}

export function validateArtworkDraft(
  draft: ArtworkDraft,
  existingArtworks: ArtworkWithTranslation[],
  currentArtworkId?: string
) {
  return artworkDraftShape.superRefine((value, context) => {
    const slug = value.slug.trim();

    if (!slug) {
      context.addIssue({
        code: 'custom',
        path: ['slug'],
        message: '작품 주소를 입력하세요.'
      });
    } else if (!slugPattern.test(slug)) {
      context.addIssue({
        code: 'custom',
        path: ['slug'],
        message: '영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.'
      });
    } else if (
      existingArtworks.some((artwork) => artwork.slug === slug && artwork.id !== currentArtworkId)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['slug'],
        message: '이미 사용 중인 주소입니다.'
      });
    }

    if (!value.artistName.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['artistName'],
        message: '작가명을 입력하세요.'
      });
    }

    if (!value.imageUrl.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['imageUrl'],
        message: '대표 이미지를 추가하세요.'
      });
    }

    if (!value.translation.title.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['translation.title'],
        message: '작품 제목을 입력하세요.'
      });
    }

    if (!value.translation.body.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['translation.body'],
        message: '작품 소개 본문을 입력하세요.'
      });
    }
  }).safeParse(draft);
}

export function normalizeArtworkDraft(draft: ArtworkDraft): ArtworkDraft {
  return {
    ...draft,
    slug: draft.slug.trim(),
    artistName: draft.artistName.trim(),
    medium: draft.medium.trim(),
    dimensions: draft.dimensions.trim(),
    location: draft.location.trim(),
    imageUrl: draft.imageUrl.trim(),
    translation: {
      locale: 'ko',
      title: draft.translation.title.trim(),
      summary: draft.translation.summary.trim(),
      body: draft.translation.body.trim(),
      artistNote: draft.translation.artistNote.trim()
    }
  };
}

function normalizeSearchText(value: string): string {
  return value.normalize('NFC').trim().toLocaleLowerCase('ko-KR');
}
