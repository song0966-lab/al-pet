import type { Exhibition } from './types';

export type ExhibitionInfoItem = {
  label: string;
  value: string;
};

const defaultViewingHours = '10:00 - 18:00';
const defaultVisitorNotice = '작품 앞에서 잠시 머물며 천천히 감상해주세요.';

export function formatExhibitionDateRange(startsAt: string, endsAt: string) {
  return `${formatDate(startsAt)} - ${formatDate(endsAt)}`;
}

export function buildExhibitionInfoItems(
  exhibition: Pick<Exhibition, 'startsAt' | 'endsAt' | 'venue'>
): ExhibitionInfoItem[] {
  return [
    { label: 'Period / 기간', value: formatExhibitionDateRange(exhibition.startsAt, exhibition.endsAt) },
    { label: 'Venue / 장소', value: exhibition.venue },
    { label: 'Hours / 관람 시간', value: defaultViewingHours },
    { label: 'Notice / 안내', value: defaultVisitorNotice }
  ];
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-');

  return [year, month, day].filter(Boolean).join('.');
}
