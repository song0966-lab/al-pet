'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { filterPublishedArtworks, searchArtworks, sortArtworks } from '@/lib/artwork-utils';
import { hasSupabaseConfig } from '@/lib/config';
import { readLocalArtworks } from '@/lib/local-artwork-storage';
import type { ArtworkWithTranslation } from '@/lib/types';
import { ArtworkCard } from '../artwork-card';

export function GalleryCatalog({ initialArtworks }: { initialArtworks: ArtworkWithTranslation[] }) {
  const [query, setQuery] = useState('');
  const [artworks, setArtworks] = useState(initialArtworks);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setArtworks(sortArtworks(filterPublishedArtworks(readLocalArtworks())));
    }
  }, []);

  const filteredArtworks = useMemo(() => searchArtworks(artworks, query), [artworks, query]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <div className="flex flex-col gap-5 border-t border-ink/20 pt-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase text-moss">Works</p>
          <h2 className="mt-2 font-serif text-4xl text-ink">작품 목록</h2>
        </div>
        <label className="focus-within:ring-clay flex w-full max-w-md items-center gap-3 border-b border-ink/30 py-3 focus-within:ring-2">
          <Search aria-hidden className="h-5 w-5 text-moss" />
          <input
            className="w-full bg-transparent text-base outline-none placeholder:text-graphite/55"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="작품명, 작가명, 재료 검색"
            value={query}
          />
        </label>
      </div>

      <div className="mt-10 space-y-10">
        {filteredArtworks.map((artwork) => (
          <ArtworkCard artwork={artwork} key={artwork.id} />
        ))}
      </div>

      {filteredArtworks.length === 0 ? (
        <p className="mt-12 border-t border-ink/15 pt-8 text-graphite">검색 결과가 없습니다.</p>
      ) : null}
    </section>
  );
}
