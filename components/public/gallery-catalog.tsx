'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { filterPublishedArtworks, searchArtworks, sortArtworks } from '@/lib/artwork-utils';
import { hasSupabaseConfig } from '@/lib/config';
import { readLocalArtworks, readLocalSections } from '@/lib/local-artwork-storage';
import { filterArtworksBySection } from '@/lib/section-utils';
import type { ArtworkWithTranslation, Section } from '@/lib/types';
import { ArtworkCard } from '../artwork-card';

export function GalleryCatalog({
  initialArtworks,
  initialSections
}: {
  initialArtworks: ArtworkWithTranslation[];
  initialSections: Section[];
}) {
  const [query, setQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('all');
  const [artworks, setArtworks] = useState(initialArtworks);
  const [sections, setSections] = useState(initialSections);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setArtworks(sortArtworks(filterPublishedArtworks(readLocalArtworks())));
      setSections(readLocalSections());
    }
  }, []);

  const sectionArtworks = useMemo(
    () => filterArtworksBySection(sortArtworks(filterPublishedArtworks(artworks)), activeSectionId),
    [activeSectionId, artworks]
  );
  const filteredArtworks = useMemo(() => searchArtworks(sectionArtworks, query), [sectionArtworks, query]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <div className="flex flex-col gap-5 border-t border-ink/20 pt-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase text-moss">Works / 작품</p>
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

      {sections.length > 0 ? (
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          <button
            aria-pressed={activeSectionId === 'all'}
            className={`focus-ring h-10 shrink-0 rounded-sm border px-4 text-sm transition ${
              activeSectionId === 'all' ? 'border-ink bg-ink text-paper' : 'border-ink/15 bg-paper text-graphite'
            }`}
            onClick={() => setActiveSectionId('all')}
            type="button"
          >
            All / 전체
          </button>
          {sections.map((section) => (
            <button
              aria-pressed={activeSectionId === section.id}
              className={`focus-ring h-10 shrink-0 rounded-sm border px-4 text-sm transition ${
                activeSectionId === section.id ? 'border-ink bg-ink text-paper' : 'border-ink/15 bg-paper text-graphite'
              }`}
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              type="button"
            >
              {section.title}
            </button>
          ))}
        </div>
      ) : null}

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
