'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { filterPublishedArtworks } from '@/lib/artwork-utils';
import { hasSupabaseConfig } from '@/lib/config';
import { readLocalArtworks } from '@/lib/local-artwork-storage';
import type { ArtworkWithTranslation } from '@/lib/types';

export function ArtworkDetailClient({
  initialArtwork,
  slug
}: {
  initialArtwork: ArtworkWithTranslation | null;
  slug: string;
}) {
  const [artwork, setArtwork] = useState(initialArtwork);
  const [loaded, setLoaded] = useState(Boolean(initialArtwork));

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      const localArtwork =
        filterPublishedArtworks(readLocalArtworks()).find((item) => item.slug === slug) ?? null;
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

  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-8 md:grid-cols-[0.95fr_1fr] md:py-14">
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
        <article className="flex flex-col justify-between gap-12">
          <div>
            <Link className="focus-ring inline-flex items-center gap-2 text-sm text-moss" href="/">
              <ArrowLeft className="h-4 w-4" />
              작품 목록
            </Link>
            <p className="mt-10 text-sm uppercase text-clay">{artwork.location}</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight text-ink md:text-6xl">
              {artwork.translation.title}
            </h1>
            <p className="mt-5 text-xl leading-8 text-graphite">{artwork.translation.summary}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-ink/15 py-6 text-sm">
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
        </article>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20 pt-4">
        <div className="space-y-7 font-serif text-2xl leading-10 text-ink">
          {artwork.translation.body.split('\n').map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {artwork.translation.artistNote ? (
          <blockquote className="mt-12 border-l-2 border-clay pl-6 text-lg leading-8 text-graphite">
            {artwork.translation.artistNote}
          </blockquote>
        ) : null}
      </section>
    </main>
  );
}
