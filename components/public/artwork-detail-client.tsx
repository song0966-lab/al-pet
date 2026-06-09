'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { filterPublishedArtworks, sortArtworks } from '@/lib/artwork-utils';
import { hasSupabaseConfig } from '@/lib/config';
import { readLocalArtworks } from '@/lib/local-artwork-storage';
import type { ArtworkWithTranslation } from '@/lib/types';

export function ArtworkDetailClient({
  initialArtwork,
  initialArtworks = initialArtwork ? [initialArtwork] : [],
  slug
}: {
  initialArtwork: ArtworkWithTranslation | null;
  initialArtworks?: ArtworkWithTranslation[];
  slug: string;
}) {
  const [artwork, setArtwork] = useState(initialArtwork);
  const [artworks, setArtworks] = useState(initialArtworks);
  const [loaded, setLoaded] = useState(Boolean(initialArtwork));

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      const localArtworks = sortArtworks(filterPublishedArtworks(readLocalArtworks()));
      const localArtwork = localArtworks.find((item) => item.slug === slug) ?? null;
      setArtworks(localArtworks);
      setArtwork(localArtwork);
    }
    setLoaded(true);
  }, [slug]);

  if (!loaded) {
    return <main className="mx-auto max-w-4xl px-5 py-20 text-graphite">불러오는 중입니다.</main>;
  }

  if (!artwork) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-20">
        <Link className="focus-ring inline-flex items-center gap-2 text-sm text-moss" href="/">
          <ArrowLeft className="h-4 w-4" />
          작품 목록
        </Link>
        <h1 className="mt-10 font-serif text-4xl text-ink">공개된 작품을 찾을 수 없습니다.</h1>
      </main>
    );
  }

  const orderedArtworks = sortArtworks(filterPublishedArtworks(artworks));
  const currentIndex = orderedArtworks.findIndex((item) => item.slug === artwork.slug);
  const previousArtwork = currentIndex > 0 ? orderedArtworks[currentIndex - 1] : null;
  const nextArtwork =
    currentIndex >= 0 && currentIndex < orderedArtworks.length - 1
      ? orderedArtworks[currentIndex + 1]
      : null;

  return (
    <main className="bg-paper">
      <article className="mx-auto max-w-6xl px-5 pb-20 pt-6 md:pt-10">
        <Link className="focus-ring inline-flex items-center gap-2 text-sm text-moss" href="/">
          <ArrowLeft className="h-4 w-4" />
          작품 목록
        </Link>

        <section
          aria-label="작품 상세"
          className="mt-6 grid items-start gap-8 md:grid-cols-[minmax(260px,0.95fr)_minmax(0,1fr)] md:gap-10"
        >
          <figure className="space-y-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-mist shadow-editorial">
              <Image
                alt={artwork.translation.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 768px) 48vw, 100vw"
                src={artwork.imageUrl}
              />
            </div>
          </figure>

          <div className="flex flex-col gap-7 md:pt-6">
            <header>
              <p className="text-sm uppercase tracking-wide text-clay">{artwork.location}</p>
              <h1 className="mt-3 font-serif text-5xl leading-tight text-ink md:text-6xl">
                {artwork.translation.title}
              </h1>
              <p className="mt-5 text-xl leading-8 text-graphite">{artwork.translation.summary}</p>
            </header>

            <dl
              aria-label="작품 기본 정보"
              className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-ink/15 py-6 text-sm"
            >
              <div>
                <dt className="text-graphite/70">작가</dt>
                <dd className="mt-1 text-ink">{artwork.artistName}</dd>
              </div>
              <div>
                <dt className="text-graphite/70">연도</dt>
                <dd className="mt-1 text-ink">{artwork.year}</dd>
              </div>
              <div>
                <dt className="text-graphite/70">재료</dt>
                <dd className="mt-1 text-ink">{artwork.medium}</dd>
              </div>
              <div>
                <dt className="text-graphite/70">크기</dt>
                <dd className="mt-1 text-ink">{artwork.dimensions}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section aria-label="작품 소개" className="mx-auto mt-12 max-w-3xl md:mt-16">
          <div className="space-y-7 text-lg leading-8 text-graphite md:font-serif md:text-2xl md:leading-10 md:text-ink">
            {artwork.translation.body.split('\n').map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {artwork.translation.artistNote ? (
          <aside
            aria-label="작가 노트"
            className="mx-auto mt-10 max-w-3xl border-l-2 border-clay pl-6 text-graphite"
          >
            <p className="text-sm font-semibold text-clay">작가 노트</p>
            <blockquote className="mt-3 text-lg leading-8">{artwork.translation.artistNote}</blockquote>
          </aside>
        ) : null}

        {previousArtwork || nextArtwork ? (
          <nav
            aria-label="이전 다음 작품"
            className="mx-auto mt-14 max-w-3xl border-y border-ink/15 py-5"
          >
            <div className="grid gap-3 md:grid-cols-2">
              {previousArtwork ? (
                <Link
                  className="focus-ring group flex flex-col gap-2 rounded-sm py-3 pr-4 text-left"
                  href={`/artworks/${previousArtwork.slug}`}
                >
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-moss">
                    <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                    이전 작품
                  </span>
                  <span className="font-serif text-2xl leading-tight text-ink">
                    {previousArtwork.translation.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden className="hidden md:block" />
              )}

              {nextArtwork ? (
                <Link
                  className="focus-ring group flex flex-col gap-2 rounded-sm py-3 text-left md:items-end md:pl-4 md:text-right"
                  href={`/artworks/${nextArtwork.slug}`}
                >
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-moss">
                    다음 작품
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                  <span className="font-serif text-2xl leading-tight text-ink">
                    {nextArtwork.translation.title}
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}
      </article>
    </main>
  );
}
