import { SiteHeader } from '@/components/site-header';
import { ExhibitionOverview } from '@/components/public/exhibition-overview';
import { GalleryCatalog } from '@/components/public/gallery-catalog';
import { getPublishedArtworks } from '@/lib/artwork-repository';
import { getCurrentExhibition } from '@/lib/exhibition-repository';

export default async function HomePage() {
  const exhibition = await getCurrentExhibition();
  const artworks = await getPublishedArtworks();

  return (
    <>
      <SiteHeader />
      <main>
        <ExhibitionOverview initialExhibition={exhibition} />
        <GalleryCatalog initialArtworks={artworks} />
      </main>
    </>
  );
}
