'use client';

import { Eye, EyeOff, Pencil, Plus, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getAdminSession,
  listAdminArtworks,
  setArtworkPublished
} from '@/lib/admin-artwork-store';
import { listAdminSections } from '@/lib/admin-section-store';
import type { AdminSession, ArtworkWithTranslation, Section } from '@/lib/types';
import { AdminShell } from './admin-shell';

const listGridClass =
  'md:grid-cols-[96px_minmax(180px,1fr)_120px_120px_120px_88px_100px_88px]';

export function AdminArtworkList() {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [artworks, setArtworks] = useState<ArtworkWithTranslation[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const sectionTitleById = useMemo(
    () => new Map(sections.map((section) => [section.id, section.title])),
    [sections]
  );

  const loadArtworks = useCallback(async () => {
    setError('');
    setIsLoading(true);
    try {
      const nextSession = await getAdminSession();
      if (!nextSession) {
        router.replace('/admin/login');
        return;
      }

      const [nextArtworks, nextSections] = await Promise.all([
        listAdminArtworks(),
        listAdminSections()
      ]);

      setSession(nextSession);
      setArtworks(nextArtworks);
      setSections(nextSections);
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
    return <main className="px-5 py-16 text-graphite">관리자 세션을 확인하는 중입니다.</main>;
  }

  return (
    <AdminShell session={session}>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-5xl text-ink">작품 관리</h1>
            <p className="mt-3 text-base leading-7 text-graphite">
              등록된 작품을 확인하고 공개 상태를 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="focus-ring inline-flex h-12 items-center gap-2 rounded-sm bg-ink px-5 text-sm font-medium text-paper"
              href="/admin/artworks/new"
            >
              <Plus className="h-4 w-4" />
              작품 추가
            </Link>
            <button
              className="focus-ring inline-flex h-12 items-center gap-2 rounded-sm border border-ink/20 px-4 text-sm text-graphite"
              onClick={loadArtworks}
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
              새로고침
            </button>
          </div>
        </div>

        {error ? <p className="mt-6 text-sm text-clay">{error}</p> : null}
        {isLoading ? <p className="mt-8 text-graphite">불러오는 중입니다.</p> : null}

        <div className="mt-8 overflow-hidden rounded-sm border border-ink/10 bg-paper">
          <div
            className={`hidden gap-4 bg-mist px-4 py-4 text-sm font-semibold text-graphite md:grid ${listGridClass}`}
          >
            <span className="col-span-2">작품</span>
            <span>작가</span>
            <span>섹션</span>
            <span>위치</span>
            <span>표시 순서</span>
            <span>상태</span>
            <span>관리</span>
          </div>

          {artworks.map((artwork) => (
            <article
              className={`grid gap-4 border-b border-ink/10 p-4 last:border-b-0 md:grid md:items-center ${listGridClass}`}
              key={artwork.id}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-mist md:aspect-square">
                <Image
                  alt={artwork.translation.title}
                  className="object-cover"
                  fill
                  sizes="96px"
                  src={artwork.imageUrl}
                />
              </div>

              <div className="min-w-0">
                <h2 className="font-serif text-2xl text-ink">{artwork.translation.title}</h2>
                <p className="mt-1 text-xs text-graphite/60">{formatArtworkSubtext(artwork)}</p>
              </div>

              <Field label="작가" value={artwork.artistName} />
              <Field label="섹션" value={getSectionTitle(artwork, sectionTitleById)} />
              <Field label="위치" value={artwork.location} />
              <Field label="표시 순서" value={String(artwork.displayOrder)} />

              <StatusCell artwork={artwork} onToggle={() => void handleToggle(artwork)} />

              <div
                aria-label={`${artwork.translation.title} 관리`}
                className="flex items-center md:justify-start"
              >
                <p className="mr-3 text-xs font-semibold text-graphite/55 md:hidden">관리</p>
                <Link
                  className="focus-ring inline-flex h-9 items-center gap-2 rounded-sm bg-ink px-3 text-sm font-medium text-paper"
                  href={`/admin/artworks/${artwork.id}`}
                >
                  <Pencil className="h-4 w-4" />
                  수정
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold text-graphite/55 md:hidden">{label}</p>
      <p className="mt-1 truncate text-sm text-graphite md:mt-0 md:text-base">{value}</p>
    </div>
  );
}

function StatusCell({
  artwork,
  onToggle
}: {
  artwork: ArtworkWithTranslation;
  onToggle: () => void;
}) {
  return (
    <div
      aria-label={`${artwork.translation.title} 상태`}
      className="flex flex-col items-start gap-2"
    >
      <p className="text-xs font-semibold text-graphite/55 md:hidden">상태</p>
      <span
        className={`inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold ${
          artwork.isPublished ? 'bg-moss/15 text-moss' : 'bg-clay/10 text-clay'
        }`}
      >
        {artwork.isPublished ? '공개' : '비공개'}
      </span>
      <button
        aria-label={artwork.isPublished ? '비공개로 전환' : '공개로 전환'}
        className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-sm border border-ink/15 text-graphite"
        onClick={onToggle}
        type="button"
      >
        {artwork.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function formatArtworkSubtext(artwork: ArtworkWithTranslation) {
  return `${artwork.medium} · ${artwork.dimensions}`;
}

function getSectionTitle(
  artwork: ArtworkWithTranslation,
  sectionTitleById: Map<string, string>
) {
  if (!artwork.sectionId) {
    return '미지정';
  }

  return sectionTitleById.get(artwork.sectionId) ?? artwork.sectionId;
}
