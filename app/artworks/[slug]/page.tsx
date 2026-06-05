import { SiteHeader } from '@/components/site-header';
import { ArtworkDetailClient } from '@/components/public/artwork-detail-client';
import { getPublishedArtworkBySlug } from '@/lib/artwork-repository';

export default async function ArtworkDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork = await getPublishedArtworkBySlug(slug);

  return (
    <>
      <SiteHeader />
      <ArtworkDetailClient initialArtwork={artwork} slug={slug} />
    </>
  );
}
