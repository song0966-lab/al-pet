'use client';

import { ExternalLink, EyeOff, FileText, Images, Plus, Tags } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getAdminSession, listAdminArtworks } from '@/lib/admin-artwork-store';
import { listAdminSections } from '@/lib/admin-section-store';
import type { AdminSession, ArtworkWithTranslation, Section } from '@/lib/types';
import { AdminShell } from './admin-shell';

const dashboardLinks = [
  {
    href: '/admin/artworks',
    title: '작품 관리',
    description: '작품 목록을 보고 공개 상태를 관리합니다.',
    icon: Images
  },
  {
    href: '/admin/artworks/new',
    title: '새 작품 추가',
    description: '작품 이미지와 설명을 새로 등록합니다.',
    icon: Plus
  },
  {
    href: '/admin/exhibition',
    title: '전시 안내',
    description: '전시명, 기간, 장소, 관람 안내를 수정합니다.',
    icon: FileText
  },
  {
    href: '/admin/sections',
    title: '섹션 관리',
    description: '작품을 묶는 카테고리를 정리합니다.',
    icon: Tags
  },
  {
    href: '/',
    title: '관람 화면 보기',
    description: '관람객에게 보이는 화면을 확인합니다.',
    icon: ExternalLink
  }
];

export function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [artworks, setArtworks] = useState<ArtworkWithTranslation[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setError('');
      setIsLoading(true);
      try {
        const nextSession = await getAdminSession();
        if (!nextSession) {
          router.replace('/admin/login');
          return;
        }

        setSession(nextSession);

        const [nextArtworks, nextSections] = await Promise.all([
          listAdminArtworks(),
          listAdminSections()
        ]);

        setArtworks(nextArtworks);
        setSections(nextSections);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : '관리자 홈 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [router]);

  if (!session) {
    return <main className="px-5 py-16 text-graphite">관리자 세션을 확인하는 중입니다.</main>;
  }

  const publishedCount = artworks.filter((artwork) => artwork.isPublished).length;
  const unpublishedCount = artworks.length - publishedCount;
  const recentArtworks = [...artworks]
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 2);
  const summaryItems = [
    { label: '전체 작품', value: artworks.length },
    { label: '공개 작품', value: publishedCount },
    { label: '비공개 작품', value: unpublishedCount },
    { label: '섹션', value: sections.length }
  ];

  return (
    <AdminShell session={session}>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-sm text-moss">관리자 대시보드</p>
        <h1 className="mt-2 font-serif text-5xl text-ink">관리자 홈</h1>
        <p className="mt-4 max-w-2xl leading-7 text-graphite">
          작품 공개 상태와 최근 수정 내용을 확인하고 필요한 관리 화면으로 바로 이동합니다.
        </p>

        {error ? <p className="mt-6 text-sm text-clay">{error}</p> : null}
        {isLoading ? <p className="mt-6 text-sm text-graphite">대시보드 정보를 불러오는 중입니다.</p> : null}

        <div aria-label="관리 요약" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summaryItems.map((item) => (
            <div
              aria-label={item.label}
              className="rounded-sm border border-ink/10 bg-paper p-5"
              key={item.label}
            >
              <p className={`text-xs font-semibold ${item.label === '비공개 작품' ? 'text-clay' : 'text-moss'}`}>
                {item.label}
              </p>
              <p className="mt-4 font-serif text-5xl leading-none text-ink">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <section aria-label="바로 확인하기" className="rounded-sm border border-ink/10 bg-paper p-5">
            <p className="text-sm font-semibold text-clay">바로 확인하기</p>
            <h2 className="mt-3 font-serif text-3xl text-ink">오늘 관리할 항목</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-graphite">
              공개 전 작품을 확인하거나 새 작품을 추가하고, 관람객 화면에서 바로 결과를 볼 수 있습니다.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-4 text-sm font-medium text-paper"
                href="/admin/artworks"
              >
                <EyeOff className="h-4 w-4" />
                비공개 작품 확인
              </Link>
              <Link
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-sm border border-ink/20 px-4 text-sm font-medium text-graphite"
                href="/admin/artworks/new"
              >
                <Plus className="h-4 w-4" />
                작품 추가
              </Link>
              <Link
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-sm border border-ink/20 px-4 text-sm font-medium text-graphite"
                href="/"
              >
                <ExternalLink className="h-4 w-4" />
                관람 화면 보기
              </Link>
            </div>
          </section>

          <section aria-label="최근 수정된 작품" className="rounded-sm border border-ink/10 bg-paper p-5">
            <p className="text-sm font-semibold text-moss">최근 수정된 작품</p>
            <div className="mt-4 space-y-3">
              {recentArtworks.map((artwork) => (
                <Link
                  className="focus-ring block border-t border-ink/10 pt-3 transition hover:text-clay"
                  href={`/admin/artworks/${artwork.id}`}
                  key={artwork.id}
                >
                  <h3 className="truncate font-serif text-2xl text-ink">{artwork.translation.title}</h3>
                  <p className="mt-1 text-sm text-graphite">
                    {artwork.location} · {artwork.isPublished ? '공개' : '비공개'}
                  </p>
                </Link>
              ))}
              {recentArtworks.length === 0 && !isLoading ? (
                <p className="border-t border-ink/10 pt-3 text-sm text-graphite">
                  최근 수정된 작품이 없습니다.
                </p>
              ) : null}
            </div>
          </section>
        </div>

        <h2 className="mt-10 font-serif text-3xl text-ink">관리 메뉴</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {dashboardLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                className="focus-ring rounded-sm border border-ink/10 bg-paper p-5 transition hover:border-ink/25"
                href={link.href}
                key={link.href}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-mist text-moss">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="font-serif text-2xl text-ink">{link.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-graphite">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}
