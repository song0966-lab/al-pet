'use client';

import { FileText, LogOut, Plus, Tags } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { signOutAdmin } from '@/lib/admin-artwork-store';
import type { AdminSession } from '@/lib/types';

export function AdminShell({
  children,
  session
}: {
  children: ReactNode;
  session: AdminSession;
}) {
  const router = useRouter();

  async function handleSignOut() {
    await signOutAdmin();
    router.replace('/admin/login');
  }

  return (
    <main className="min-h-screen bg-[#efeee8]">
      <header className="border-b border-ink/10 bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link className="focus-ring font-serif text-2xl" href="/admin/artworks">
              Exhibition Admin / 전시 관리자
            </Link>
            <p className="mt-1 text-sm text-paper/65">{session.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-sm border border-paper/25 px-4 text-sm text-paper"
              href="/admin/exhibition"
            >
              <FileText className="h-4 w-4" />
              Guide / 전시 안내
            </Link>
            <Link
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-sm border border-paper/25 px-4 text-sm text-paper"
              href="/admin/sections"
            >
              <Tags className="h-4 w-4" />
              Sections / 섹션
            </Link>
            <Link
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-sm bg-paper px-4 text-sm font-medium text-ink"
              href="/admin/artworks/new"
            >
              <Plus className="h-4 w-4" />
              New Artwork / 새 작품
            </Link>
            <button
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-sm border border-paper/25 px-4 text-sm text-paper"
              onClick={handleSignOut}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Logout / 로그아웃
            </button>
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}
