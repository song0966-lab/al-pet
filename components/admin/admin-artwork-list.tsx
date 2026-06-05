'use client';

import { Eye, EyeOff, Pencil, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  getAdminSession,
  listAdminArtworks,
  setArtworkPublished
} from '@/lib/admin-artwork-store';
import type { AdminSession, ArtworkWithTranslation } from '@/lib/types';
import { AdminShell } from './admin-shell';

export function AdminArtworkList() {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [artworks, setArtworks] = useState<ArtworkWithTranslation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadArtworks = useCallback(async () => {
    setError('');
    setIsLoading(true);
    try {
      const nextSession = await getAdminSession();
      if (!nextSession) {
        router.replace('/admin/login');
        return;
      }
      setSession(nextSession);
      setArtworks(await listAdminArtworks());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '작품을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadArtworks();
  }, [loadArtworks]);

  async function handleToggle(artwork: ArtworkWithTranslation) {
    if (!session) return;
    await setArtworkPublished({
      artworkId: artwork.id,
      isPublished: !artwork.isPublished,
      userEmail: session.email
    });
    await loadArtworks();
  }

  if (!session) {
    return <main className="px-5 py-16 text-graphite">관리자 세션을 확인 중입니다.</main>;
  }

  return (
    <AdminShell session={session}>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase text-moss">Collection / 작품 관리</p>
            <h1 className="mt-2 font-serif text-5xl text-ink">작품 관리</h1>
          </div>
          <button
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-sm border border-ink/20 px-4 text-sm text-graphite"
            onClick={loadArtworks}
            type="button"
          >
            <RefreshCw className="h-4 w-4" />
            새로고침
          </button>
        </div>

        {error ? <p className="mt-6 text-sm text-clay">{error}</p> : null}
        {isLoading ? <p className="mt-8 text-graphite">불러오는 중입니다.</p> : null}

        <div className="mt-8 overflow-hidden rounded-sm border border-ink/10 bg-paper">
          {artworks.map((artwork) => (
            <article
              className="grid gap-4 border-b border-ink/10 p-4 last:border-b-0 md:grid-cols-[96px_1fr_auto]"
              key={artwork.id}
            >
              <div className="relative aspect-square overflow-hidden rounded-sm bg-mist">
                <Image
                  alt={artwork.translation.title}
                  className="object-cover"
                  fill
                  sizes="96px"
                  src={artwork.imageUrl}
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-2xl text-ink">{artwork.translation.title}</h2>
                  <span className="rounded-sm bg-mist px-2 py-1 text-xs text-graphite">
                    {artwork.isPublished ? '공개' : '비공개'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-graphite">
                  {artwork.artistName} · {artwork.year} · {artwork.location}
                </p>
                <p className="mt-2 text-sm text-graphite/75">/{artwork.slug}</p>
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <button
                  aria-label={artwork.isPublished ? '비공개로 전환' : '공개로 전환'}
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-sm border border-ink/15 text-graphite"
                  onClick={() => void handleToggle(artwork)}
                  type="button"
                >
                  {artwork.isPublished ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <Link
                  aria-label="작품 수정"
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-sm bg-ink text-paper"
                  href={`/admin/artworks/${artwork.id}`}
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
          {artworks.length === 0 && !isLoading ? (
            <p className="p-8 text-graphite">등록된 작품이 없습니다.</p>
          ) : null}
        </div>
      </section>
    </AdminShell>
  );
}
