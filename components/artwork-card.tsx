import Image from 'next/image';
import Link from 'next/link';
import type { ArtworkWithTranslation } from '@/lib/types';

export function ArtworkCard({ artwork }: { artwork: ArtworkWithTranslation }) {
  return (
    <Link className="group block focus-ring" href={`/artworks/${artwork.slug}`}>
      <article className="grid gap-4 border-t border-ink/15 pt-5 md:grid-cols-[minmax(220px,0.8fr)_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-mist">
          <Image
            alt={artwork.translation.title}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            fill
            sizes="(min-width: 768px) 32vw, 100vw"
            src={artwork.imageUrl}
          />
        </div>
        <div className="flex flex-col justify-between gap-7">
          <div>
            <p className="text-sm uppercase text-moss">{artwork.location}</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-ink md:text-4xl">
              {artwork.translation.title}
            </h2>
            <p className="mt-3 text-base text-graphite">{artwork.artistName}</p>
          </div>
          <dl className="grid grid-cols-1 gap-3 border-t border-ink/10 pt-4 text-sm text-graphite sm:grid-cols-3">
            <div>
              <dt className="text-xs text-graphite/65">연도</dt>
              <dd className="mt-1 text-ink">{artwork.year}</dd>
            </div>
            <div>
              <dt className="text-xs text-graphite/65">재료</dt>
              <dd className="mt-1 text-ink">{artwork.medium}</dd>
            </div>
            <div>
              <dt className="text-xs text-graphite/65">크기</dt>
              <dd className="mt-1 text-ink">{artwork.dimensions}</dd>
            </div>
          </dl>
        </div>
      </article>
    </Link>
  );
}
