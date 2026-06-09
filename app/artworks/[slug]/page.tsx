import { SiteHeader } from '@/components/site-header';
import { ArtworkDetailClient } from '@/components/public/artwork-detail-client';
import { getPublishedArtworkBySlug, getPublishedArtworks } from '@/lib/artwork-repository';

export default async function ArtworkDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [artwork, artworks] = await Promise.all([
    getPublishedArtworkBySlug(slug),
    getPublishedArtworks()
  ]);

  return (
    <>
      <SiteHeader />
      <ArtworkDetailClient initialArtwork={artwork} initialArtworks={artworks} slug={slug} />
    </>
  );
}
