'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { filterPublishedArtworks, searchArtworks, sortArtworks } from '@/lib/artwork-utils';
import { hasSupabaseConfig } from '@/lib/config';
import { readLocalArtworks, readLocalSections } from '@/lib/local-artwork-storage';
import { filterArtworksBySection } from '@/lib/section-utils';
import type { ArtworkWithTranslation, Section } from '@/lib/types';
import { ArtworkCard } from '../artwork-card';

const galleryScrollStateKey = 'exhibition-gallery-scroll-state';

type GalleryScrollState = {
  activeSectionId: string;
  query: string;
  scrollY: number;
};

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
  const [pendingScrollY, setPendingScrollY] = useState<number | null>(null);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setArtworks(sortArtworks(filterPublishedArtworks(readLocalArtworks())));
      setSections(readLocalSections());
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('restore') !== 'gallery') {
      return;
    }

    try {
      const savedState = window.sessionStorage.getItem(galleryScrollStateKey);
      const parsedState = savedState ? (JSON.parse(savedState) as Partial<GalleryScrollState>) : null;

      if (typeof parsedState?.query === 'string') {
        setQuery(parsedState.query);
      }
      if (typeof parsedState?.activeSectionId === 'string') {
        setActiveSectionId(parsedState.activeSectionId);
      }
      if (typeof parsedState?.scrollY === 'number') {
        setPendingScrollY(parsedState.scrollY);
      }

      window.sessionStorage.removeItem(galleryScrollStateKey);
    } catch {
      window.sessionStorage.removeItem(galleryScrollStateKey);
    }

    params.delete('restore');
    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, []);

  const sectionArtworks = useMemo(
    () => filterArtworksBySection(sortArtworks(filterPublishedArtworks(artworks)), activeSectionId),
    [activeSectionId, artworks]
  );
  const filteredArtworks = useMemo(() => searchArtworks(sectionArtworks, query), [sectionArtworks, query]);

  useEffect(() => {
    if (pendingScrollY === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      window.scrollTo({ behavior: 'auto', top: pendingScrollY });
      setPendingScrollY(null);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [filteredArtworks.length, pendingScrollY]);

  const saveGalleryScrollState = () => {
    try {
      window.sessionStorage.setItem(
        galleryScrollStateKey,
        JSON.stringify({
          activeSectionId,
          query,
          scrollY: window.scrollY
        } satisfies GalleryScrollState)
      );
    } catch {
      // Returning to the catalog still works even if private browsing blocks storage.
    }
  };

  return (
    <section aria-label="작품 목록" className="mx-auto max-w-6xl px-5 pb-10 pt-6 md:pb-16 md:pt-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase text-moss">Works</p>
          <h2 className="mt-2 font-serif text-4xl text-ink">작품 목록</h2>
        </div>
        <label className="focus-within:ring-clay flex w-full max-w-md items-center gap-3 border-b border-ink/30 py-3 focus-within:ring-2 md:ml-auto">
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
        <div
          aria-label="작품 카테고리"
          className="mt-6 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0"
        >
          <button
            aria-pressed={activeSectionId === 'all'}
            className={`focus-ring h-10 shrink-0 rounded-sm border px-4 text-sm transition ${
              activeSectionId === 'all' ? 'border-ink bg-ink text-paper' : 'border-ink/15 bg-paper text-graphite'
            }`}
            onClick={() => setActiveSectionId('all')}
            type="button"
          >
            전체
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

      <div aria-label="작품 카드 목록" className="mt-10 grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-12">
        {filteredArtworks.map((artwork) => (
          <ArtworkCard artwork={artwork} key={artwork.id} onOpenArtwork={saveGalleryScrollState} />
        ))}
      </div>

      {filteredArtworks.length === 0 ? (
        <p className="mt-12 border-t border-ink/15 pt-8 text-graphite">검색 결과가 없습니다.</p>
      ) : null}
    </section>
  );
}
