import { ArtworkEditor } from '@/components/admin/artwork-editor';

export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArtworkEditor artworkId={id} />;
}
