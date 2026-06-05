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
            <p className="mt-3 max-w-2xl text-base leading-7 text-graphite">
              {artwork.translation.summary}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-graphite md:grid-cols-4">
            <span>{artwork.artistName}</span>
            <span>{artwork.year}</span>
            <span>{artwork.medium}</span>
            <span>{artwork.dimensions}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
