import { SiteHeader } from '@/components/site-header';
import { GalleryCatalog } from '@/components/public/gallery-catalog';
import { getPublishedArtworks } from '@/lib/artwork-repository';

export default async function HomePage() {
  const artworks = await getPublishedArtworks();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-5 pb-8 pt-12 md:pt-20">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div>
              <p className="text-sm uppercase text-moss">Single Exhibition Catalog</p>
              <h1 className="mt-4 max-w-3xl font-serif text-6xl leading-none text-ink md:text-8xl">
                머무는 시선의 기록
              </h1>
            </div>
            <p className="max-w-xl text-lg leading-8 text-graphite">
              작품 앞에서 잠시 멈추는 시간을 위해 만든 전시 카탈로그입니다. 이미지와
              작가의 문장을 따라가며 이번 전시의 흐름을 읽어보세요.
            </p>
          </div>
        </section>
        <GalleryCatalog initialArtworks={artworks} />
      </main>
    </>
  );
}
