import { CalendarDays, Clock, Info, MapPin } from 'lucide-react';

import { buildExhibitionInfoItems } from '@/lib/exhibition-info';
import type { Exhibition } from '@/lib/types';

const guideIcons = {
  'Period / 기간': CalendarDays,
  'Venue / 장소': MapPin,
  'Hours / 관람 시간': Clock,
  'Notice / 안내': Info
};

export function ExhibitionInfoPanel({ exhibition }: { exhibition: Exhibition }) {
  const guideItems = buildExhibitionInfoItems(exhibition);

  return (
    <section className="mx-auto max-w-6xl px-5 pb-8">
      <div className="border-y border-ink/15 py-6 md:py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase text-moss">Exhibition Guide / 전시 안내</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-ink md:text-4xl">관람 전 확인하기</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-graphite">
            전시장에 도착했을 때 바로 확인하면 좋은 기본 안내를 모았습니다.
          </p>
        </div>

        <dl className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {guideItems.map((item) => {
            const Icon = guideIcons[item.label as keyof typeof guideIcons] ?? Info;

            return (
              <div className="min-h-28 rounded-sm border border-ink/10 bg-white/45 p-4" key={item.label}>
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-moss">
                  <Icon aria-hidden className="h-4 w-4" />
                  {item.label}
                </dt>
                <dd className="mt-3 text-base font-medium leading-7 text-ink">{item.value}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
