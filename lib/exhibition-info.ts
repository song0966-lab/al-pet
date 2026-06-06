import type { Exhibition } from './types';

export type ExhibitionInfoItem = {
  label: string;
  value: string;
};

export const defaultViewingHours = '10:00 - 18:00';
export const defaultVisitorNotice = '작품 앞에서 잠시 머물며 천천히 감상해주세요.';

export function formatExhibitionDateRange(startsAt: string, endsAt: string) {
  return `${formatDate(startsAt)} - ${formatDate(endsAt)}`;
}

export function buildExhibitionInfoItems(
  exhibition: Pick<Exhibition, 'startsAt' | 'endsAt' | 'venue'> &
    Partial<Pick<Exhibition, 'viewingHours' | 'visitorNotice'>>
): ExhibitionInfoItem[] {
  const guideFields = withExhibitionGuideDefaults(exhibition);

  return [
    { label: 'Period / 기간', value: formatExhibitionDateRange(exhibition.startsAt, exhibition.endsAt) },
    { label: 'Venue / 장소', value: exhibition.venue },
    { label: 'Hours / 관람 시간', value: guideFields.viewingHours },
    { label: 'Notice / 안내', value: guideFields.visitorNotice }
  ];
}

export function withExhibitionGuideDefaults<T extends Partial<Pick<Exhibition, 'viewingHours' | 'visitorNotice'>>>(
  exhibition: T
): T & Pick<Exhibition, 'viewingHours' | 'visitorNotice'> {
  return {
    ...exhibition,
    viewingHours: exhibition.viewingHours?.trim() || defaultViewingHours,
    visitorNotice: exhibition.visitorNotice?.trim() || defaultVisitorNotice
  };
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-');

  return [year, month, day].filter(Boolean).join('.');
}
