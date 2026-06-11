import { SiteHeader } from '@/components/site-header';
import { ExhibitionMapPanel } from '@/components/public/exhibition-map-panel';
import { ExhibitionOverview } from '@/components/public/exhibition-overview';
import { GalleryCatalog } from '@/components/public/gallery-catalog';
import { getPublishedArtworks } from '@/lib/artwork-repository';
import { getCurrentExhibition } from '@/lib/exhibition-repository';
import { getSections } from '@/lib/section-repository';

export default async function HomePage() {
  const [exhibition, artworks, sections] = await Promise.all([
    getCurrentExhibition(),
    getPublishedArtworks(),
    getSections()
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <ExhibitionOverview initialExhibition={exhibition} />
        <ExhibitionMapPanel artworks={artworks} />
        <GalleryCatalog initialArtworks={artworks} initialSections={sections} />
      </main>
    </>
  );
}
