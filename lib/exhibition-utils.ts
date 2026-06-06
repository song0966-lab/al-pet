import { z } from 'zod';
import type { ExhibitionDraft } from './types';

const exhibitionDraftShape = z.object({
  title: z.string(),
  subtitle: z.string(),
  venue: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  viewingHours: z.string(),
  visitorNotice: z.string(),
  heroImageUrl: z.string(),
  introduction: z.string(),
  curatorNote: z.string(),
  isPublished: z.boolean()
});

export function validateExhibitionDraft(draft: ExhibitionDraft) {
  return exhibitionDraftShape
    .superRefine((value, context) => {
      if (!value.title.trim()) {
        context.addIssue({ code: 'custom', path: ['title'], message: '전시명을 입력하세요.' });
      }

      if (!value.venue.trim()) {
        context.addIssue({ code: 'custom', path: ['venue'], message: '전시 장소를 입력하세요.' });
      }

      if (!value.startsAt.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['startsAt'],
          message: '전시 시작일을 입력하세요.'
        });
      }

      if (!value.endsAt.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['endsAt'],
          message: '전시 종료일을 입력하세요.'
        });
      }

      if (value.startsAt.trim() && value.endsAt.trim() && value.endsAt < value.startsAt) {
        context.addIssue({
          code: 'custom',
          path: ['endsAt'],
          message: '종료일은 시작일 이후여야 합니다.'
        });
      }

      if (!value.viewingHours.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['viewingHours'],
          message: '관람 시간을 입력하세요.'
        });
      }

      if (!value.visitorNotice.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['visitorNotice'],
          message: '관람 안내 문구를 입력하세요.'
        });
      }

      if (!value.heroImageUrl.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['heroImageUrl'],
          message: '대표 이미지를 추가하세요.'
        });
      }

      if (!value.introduction.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['introduction'],
          message: '전시 소개문을 입력하세요.'
        });
      }

      if (!value.curatorNote.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['curatorNote'],
          message: '큐레이터 노트를 입력하세요.'
        });
      }
    })
    .safeParse(draft);
}

export function normalizeExhibitionDraft(draft: ExhibitionDraft): ExhibitionDraft {
  return {
    title: draft.title.trim(),
    subtitle: draft.subtitle.trim(),
    venue: draft.venue.trim(),
    startsAt: draft.startsAt.trim(),
    endsAt: draft.endsAt.trim(),
    viewingHours: draft.viewingHours.trim(),
    visitorNotice: draft.visitorNotice.trim(),
    heroImageUrl: draft.heroImageUrl.trim(),
    introduction: draft.introduction.trim(),
    curatorNote: draft.curatorNote.trim(),
    isPublished: draft.isPublished
  };
}
