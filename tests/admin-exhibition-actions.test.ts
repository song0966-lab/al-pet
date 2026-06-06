import { describe, expect, it } from 'vitest';

import { updateExhibitionDetails } from '@/lib/admin-exhibition-actions';
import type { Exhibition, ExhibitionDraft } from '@/lib/types';

const currentExhibition: Exhibition = {
  id: 'exhibition-1',
  title: 'Original Exhibition',
  subtitle: 'Before edit',
  venue: 'Old Gallery',
  startsAt: '2026-06-01',
  endsAt: '2026-06-30',
  viewingHours: '10:00 - 18:00',
  visitorNotice: 'Original notice',
  heroImageUrl: 'https://example.com/hero.jpg',
  introduction: 'Original introduction',
  curatorNote: 'Original curator note',
  isPublished: true,
  createdBy: 'owner@example.com',
  updatedBy: 'owner@example.com',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z'
};

const draft: ExhibitionDraft = {
  title: ' Updated Exhibition ',
  subtitle: 'New subtitle',
  venue: ' New Gallery ',
  startsAt: '2026-07-01',
  endsAt: '2026-07-30',
  viewingHours: ' 11:00 - 19:00 ',
  visitorNotice: ' 천천히 관람해주세요. ',
  heroImageUrl: 'https://example.com/new-hero.jpg',
  introduction: 'New introduction',
  curatorNote: 'New curator note',
  isPublished: true
};

describe('admin exhibition actions', () => {
  it('updates exhibition guide fields while keeping creation audit fields', () => {
    const result = updateExhibitionDetails({
      currentExhibition,
      draft,
      userEmail: 'editor@example.com',
      now: '2026-06-06T12:00:00.000Z'
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.exhibition).toMatchObject({
      id: 'exhibition-1',
      title: 'Updated Exhibition',
      venue: 'New Gallery',
      viewingHours: '11:00 - 19:00',
      visitorNotice: '천천히 관람해주세요.',
      createdBy: 'owner@example.com',
      updatedBy: 'editor@example.com',
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-06-06T12:00:00.000Z'
    });
  });
});
