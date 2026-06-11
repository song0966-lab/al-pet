'use client';

import { ALargeSmall, ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
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
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isLargeReadingText, setIsLargeReadingText] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      const localArtworks = sortArtworks(filterPublishedArtworks(readLocalArtworks()));
      const localArtwork = localArtworks.find((item) => item.slug === slug) ?? null;
      setArtworks(localArtworks);
      setArtwork(localArtwork);
    }
    setLoaded(true);
  }, [slug]);

  useEffect(() => {
    if (!isImageViewerOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsImageViewerOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImageViewerOpen]);

  if (!loaded) {
    return <main className="mx-auto max-w-4xl px-5 py-20 text-graphite">불러오는 중입니다.</main>;
  }

  if (!artwork) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-20">
        <Link className="focus-ring inline-flex items-center gap-2 text-sm text-moss" href="/?restore=gallery">
          <ArrowLeft className="h-4 w-4" />
          작품 목록
        </Link>
        <h1 className="mt-10 font-serif text-4xl text-ink">공개된 작품을 찾을 수 없습니다.</h1>
      </main>
    );
  }

  const orderedArtworks = sortArtworks(filterPublishedArtworks(artworks));
  const currentIndex = orderedArtworks.findIndex((item) => item.slug === artwork.slug);
  const hasArtworkPosition = currentIndex >= 0 && orderedArtworks.length > 1;
  const previousArtwork = currentIndex > 0 ? orderedArtworks[currentIndex - 1] : null;
  const nextArtwork =
    currentIndex >= 0 && currentIndex < orderedArtworks.length - 1
      ? orderedArtworks[currentIndex + 1]
      : null;
  const readingTextClassName = isLargeReadingText
    ? 'space-y-7 text-xl leading-9 text-graphite md:font-serif md:text-3xl md:leading-[3rem] md:text-ink'
    : 'space-y-7 text-lg leading-8 text-graphite md:font-serif md:text-2xl md:leading-10 md:text-ink';
  const artistNoteClassName = isLargeReadingText
    ? 'mt-3 text-xl leading-9 md:text-2xl md:leading-10'
    : 'mt-3 text-lg leading-8';

  return (
    <main className="bg-paper">
      <article className="mx-auto max-w-6xl px-5 pb-20 pt-6 md:pt-10">
        <div className="flex items-center justify-between gap-4">
          <Link className="focus-ring inline-flex items-center gap-2 text-sm text-moss" href="/?restore=gallery">
            <ArrowLeft className="h-4 w-4" />
            작품 목록
          </Link>
          <button
            aria-pressed={isLargeReadingText}
            className={`focus-ring inline-flex h-8 shrink-0 items-center gap-1.5 rounded-sm border px-2.5 text-xs font-semibold transition ${
              isLargeReadingText
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/20 bg-paper text-ink hover:border-ink/40'
            }`}
            onClick={() => setIsLargeReadingText((current) => !current)}
            type="button"
          >
            <ALargeSmall className="h-3.5 w-3.5" aria-hidden="true" />
            {isLargeReadingText ? '기본 글자' : '글자 크게'}
          </button>
        </div>

        <section
          aria-label="작품 상세"
          className="mt-6 grid items-start gap-8 md:grid-cols-[minmax(260px,0.95fr)_minmax(0,1fr)] md:gap-10"
        >
          <figure className="space-y-3">
            <button
              aria-label="작품 이미지 크게 보기"
              className="focus-ring group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-sm bg-mist text-left shadow-editorial"
              type="button"
              onClick={() => setIsImageViewerOpen(true)}
            >
              <Image
                alt={artwork.translation.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 768px) 48vw, 100vw"
                src={artwork.imageUrl}
              />
              <span className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-sm bg-paper/90 text-ink shadow-sm transition group-hover:bg-ink group-hover:text-paper">
                <Maximize2 className="h-5 w-5" aria-hidden="true" />
              </span>
            </button>
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
          <div className={readingTextClassName}>
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
            <blockquote className={artistNoteClassName}>{artwork.translation.artistNote}</blockquote>
          </aside>
        ) : null}

        {hasArtworkPosition ? (
          <div aria-label="작품 순서" className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-clay">현재 작품</p>
            <p className="mt-2 font-serif text-3xl leading-none text-ink">
              {currentIndex + 1} / {orderedArtworks.length}
            </p>
          </div>
        ) : null}

        {previousArtwork || nextArtwork ? (
          <nav
            aria-label="이전 다음 작품"
            className="mx-auto mt-6 max-w-3xl border-y border-ink/15 py-5"
          >
            <div className="grid grid-cols-2 gap-4 md:gap-3">
              {previousArtwork ? (
                <Link
                  className="focus-ring group flex min-w-0 flex-col gap-1.5 rounded-sm py-3 pr-3 text-left md:gap-2 md:pr-4"
                  href={`/artworks/${previousArtwork.slug}`}
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-moss md:gap-2 md:text-sm">
                    <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1 md:h-4 md:w-4" />
                    이전 작품
                  </span>
                  <span className="block truncate font-serif text-xl leading-tight text-ink md:text-2xl">
                    {previousArtwork.translation.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden className="hidden md:block" />
              )}

              {nextArtwork ? (
                <Link
                  className="focus-ring group flex min-w-0 flex-col items-end gap-1.5 rounded-sm py-3 pl-3 text-right md:gap-2 md:pl-4"
                  href={`/artworks/${nextArtwork.slug}`}
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-moss md:gap-2 md:text-sm">
                    다음 작품
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1 md:h-4 md:w-4" />
                  </span>
                  <span className="block max-w-full truncate font-serif text-xl leading-tight text-ink md:text-2xl">
                    {nextArtwork.translation.title}
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}
      </article>

      {isImageViewerOpen ? (
        <div
          aria-label="확대 이미지"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-contain bg-ink/90 px-4 py-6 text-paper md:px-8"
          role="dialog"
          onClick={() => setIsImageViewerOpen(false)}
        >
          <button
            aria-label="확대 이미지 닫기"
            className="focus-ring absolute right-4 top-4 z-10 inline-flex h-12 w-12 touch-manipulation items-center justify-center rounded-sm bg-paper text-ink shadow-sm md:right-6 md:top-6"
            type="button"
            onClick={() => setIsImageViewerOpen(false)}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <figure
            className="w-full max-w-6xl"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="relative h-[78vh] min-h-[320px] w-full">
              <Image
                alt={`${artwork.translation.title} 확대 이미지`}
                className="object-contain"
                fill
                sizes="100vw"
                src={artwork.imageUrl}
              />
            </div>
            <figcaption className="mt-4 text-center font-serif text-2xl leading-tight">
              {artwork.translation.title}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </main>
  );
}
