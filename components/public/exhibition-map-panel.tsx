import { MapPin } from 'lucide-react';
import Link from 'next/link';

import { filterPublishedArtworks, sortArtworks } from '@/lib/artwork-utils';
import type { ArtworkWithTranslation } from '@/lib/types';

type MapEntry = {
  artwork: ArtworkWithTranslation;
  location: string;
  title: string;
  x: number;
  y: number;
};

const zoneLabels = [
  { key: 'A', label: 'A 구역', className: 'left-[12%] top-[18%]' },
  { key: 'B', label: 'B 구역', className: 'right-[13%] top-[18%]' },
  { key: 'C', label: 'C 구역', className: 'left-[45%] bottom-[15%]' }
];

export function ExhibitionMapPanel({ artworks }: { artworks: ArtworkWithTranslation[] }) {
  const entries = sortArtworks(filterPublishedArtworks(artworks))
    .filter((artwork) => artwork.location.trim())
    .map((artwork, index) => {
      const position = getMarkerPosition(artwork.location, index);

      return {
        artwork,
        location: artwork.location.trim(),
        title: artwork.translation.title,
        x: position.x,
        y: position.y
      };
    });

  if (entries.length === 0) {
    return null;
  }

  return (
    <section aria-label="전시장 지도" className="mx-auto max-w-6xl px-5 pb-8 pt-4 md:pb-12">
      <div className="border-y border-ink/15 py-6 md:py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-moss">전시 위치</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-ink md:text-4xl">전시장 지도</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-graphite">위치 번호는 작품 카드의 위치와 같습니다.</p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
          <div className="relative min-h-[320px] overflow-hidden rounded-sm border border-ink/10 bg-white/45">
            <div className="absolute inset-x-[6%] inset-y-[9%] border-4 border-ink/25" aria-hidden="true" />
            <div className="absolute left-[49%] top-[9%] h-[82%] border-l border-ink/20" aria-hidden="true" />
            <div className="absolute left-[6%] right-[6%] top-[48%] border-t border-ink/20" aria-hidden="true" />
            <div className="absolute bottom-[9%] left-[38%] h-[15%] border-l border-ink/20" aria-hidden="true" />

            {zoneLabels.map((zone) => (
              <span
                className={`absolute ${zone.className} text-sm font-semibold text-moss`}
                key={zone.key}
              >
                {zone.label}
              </span>
            ))}

            {entries.map((entry) => (
              <Link
                aria-label={`지도 위치 ${entry.location} ${entry.title}`}
                className="focus-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                href={`/artworks/${entry.artwork.slug}`}
                key={entry.artwork.id}
                style={{ left: `${entry.x}%`, top: `${entry.y}%` }}
              >
                <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-clay px-2 text-xs font-bold text-paper shadow-sm transition hover:bg-ink">
                  {entry.location}
                </span>
              </Link>
            ))}
          </div>

          <div className="border-t border-ink/15 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-clay">
              <MapPin aria-hidden className="h-4 w-4" />
              지도 번호
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {entries.map((entry) => (
                <Link
                  aria-label={`${entry.location} ${entry.title}`}
                  className="focus-ring flex min-w-0 items-center gap-3 border-t border-ink/10 py-3 text-sm transition hover:text-clay"
                  href={`/artworks/${entry.artwork.slug}`}
                  key={entry.artwork.id}
                >
                  <span className="shrink-0 font-semibold text-clay">{entry.location}</span>
                  <span className="truncate text-ink">{entry.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getMarkerPosition(location: string, index: number): { x: number; y: number } {
  const zone = location.trim().slice(0, 1).toUpperCase();
  const numberMatch = location.match(/\d+/);
  const number = numberMatch ? Number(numberMatch[0]) : index + 1;
  const offset = (number - 1) % 4;
  const row = Math.floor((number - 1) / 4);

  if (zone === 'A') {
    return { x: 17 + offset * 9, y: 34 + (row % 2) * 15 };
  }

  if (zone === 'B') {
    return { x: 58 + offset * 9, y: 34 + (row % 2) * 15 };
  }

  if (zone === 'C') {
    return { x: 27 + offset * 12, y: 68 + (row % 2) * 10 };
  }

  return { x: 20 + (index % 5) * 14, y: 76 };
}
