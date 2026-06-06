import { describe, expect, it } from 'vitest';
import {
  normalizeExhibitionDraft,
  validateExhibitionDraft
} from '@/lib/exhibition-utils';
import type { ExhibitionDraft } from '@/lib/types';

const validDraft: ExhibitionDraft = {
  title: '머무는 시선의 기록',
  subtitle: '단일 전시를 위한 디지털 작품 안내',
  venue: '화이트룸 갤러리',
  startsAt: '2026-06-01',
  endsAt: '2026-06-30',
  viewingHours: '10:00 - 18:00',
  visitorNotice: '작품 앞에서 잠시 머물며 천천히 감상해주세요.',
  heroImageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
  introduction: '작품 앞에서 잠시 멈추는 시간을 위해 만든 전시입니다.',
  curatorNote: '작품과 관람자의 시선이 천천히 만나는 방식을 기록합니다.',
  isPublished: true
};

describe('exhibition draft validation', () => {
  it('accepts a complete single-exhibition draft', () => {
    const result = validateExhibitionDraft(validDraft);

    expect(result.success).toBe(true);
  });

  it('requires title, venue, date range, image, introduction, and curator note', () => {
    const result = validateExhibitionDraft({
      title: '',
      subtitle: '',
      venue: '',
      startsAt: '',
      endsAt: '',
      viewingHours: '',
      visitorNotice: '',
      heroImageUrl: '',
      introduction: '',
      curatorNote: '',
      isPublished: false
    });

    expect(result.success).toBe(false);
    const fieldErrors = result.error?.flatten().fieldErrors as Record<string, string[]>;
    expect(fieldErrors.title).toContain('전시명을 입력하세요.');
    expect(fieldErrors.venue).toContain('전시 장소를 입력하세요.');
    expect(fieldErrors.startsAt).toContain('전시 시작일을 입력하세요.');
    expect(fieldErrors.endsAt).toContain('전시 종료일을 입력하세요.');
    expect(fieldErrors.viewingHours).toContain('관람 시간을 입력하세요.');
    expect(fieldErrors.visitorNotice).toContain('관람 안내 문구를 입력하세요.');
    expect(fieldErrors.heroImageUrl).toContain('대표 이미지를 추가하세요.');
    expect(fieldErrors.introduction).toContain('전시 소개문을 입력하세요.');
    expect(fieldErrors.curatorNote).toContain('큐레이터 노트를 입력하세요.');
  });

  it('rejects a date range where the end date is earlier than the start date', () => {
    const result = validateExhibitionDraft({
      ...validDraft,
      startsAt: '2026-07-01',
      endsAt: '2026-06-30'
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.endsAt).toContain(
      '종료일은 시작일 이후여야 합니다.'
    );
  });

  it('trims text fields while preserving publication state', () => {
    const normalized = normalizeExhibitionDraft({
      ...validDraft,
      title: '  머무는 시선의 기록  ',
      venue: '  화이트룸 갤러리  ',
      isPublished: false
    });

    expect(normalized).toMatchObject({
      title: '머무는 시선의 기록',
      venue: '화이트룸 갤러리',
      isPublished: false
    });
  });
});
