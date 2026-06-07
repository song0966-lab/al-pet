'use client';

import { ExternalLink, FileText, Images, Plus, Tags } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getAdminSession } from '@/lib/admin-artwork-store';
import type { AdminSession } from '@/lib/types';
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

  useEffect(() => {
    async function load() {
      const nextSession = await getAdminSession();
      if (!nextSession) {
        router.replace('/admin/login');
        return;
      }

      setSession(nextSession);
    }

    void load();
  }, [router]);

  if (!session) {
    return <main className="px-5 py-16 text-graphite">관리자 세션을 확인하는 중입니다.</main>;
  }

  return (
    <AdminShell session={session}>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-sm uppercase text-moss">Dashboard / 관리자 홈</p>
        <h1 className="mt-2 font-serif text-5xl text-ink">관리자 홈</h1>
        <p className="mt-4 max-w-2xl leading-7 text-graphite">
          작품, 전시 안내, 섹션을 관리하고 관람객 화면을 바로 확인할 수 있습니다.
        </p>

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
