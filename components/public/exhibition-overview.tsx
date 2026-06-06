'use client';

import { useEffect, useState } from 'react';

import { hasSupabaseConfig } from '@/lib/config';
import { readLocalExhibition } from '@/lib/local-artwork-storage';
import type { Exhibition } from '@/lib/types';
import { ExhibitionInfoPanel } from './exhibition-info-panel';

export function ExhibitionOverview({ initialExhibition }: { initialExhibition: Exhibition }) {
  const [exhibition, setExhibition] = useState(initialExhibition);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setExhibition(readLocalExhibition());
    }
  }, []);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-12 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="text-sm uppercase text-moss">Single Exhibition Catalog / 단일 전시 카탈로그</p>
            <h1 className="mt-4 max-w-3xl font-serif text-6xl leading-none text-ink md:text-8xl">
              {exhibition.title}
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-graphite">{exhibition.introduction}</p>
        </div>
      </section>
      <ExhibitionInfoPanel exhibition={exhibition} />
    </>
  );
}
