'use client';

import { LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { signOutAdmin } from '@/lib/admin-artwork-store';
import type { AdminSession } from '@/lib/types';

export function AdminShell({ children, session }: { children: ReactNode; session: AdminSession }) {
  const router = useRouter();

  async function handleSignOut() {
    await signOutAdmin();
    router.replace('/admin/login');
  }

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-paper/95">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <Link className="font-serif text-xl text-ink focus-ring" href="/admin/artworks">
              Exhibition Admin
            </Link>
            <p className="mt-1 text-xs text-graphite">{session.email}</p>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-sm bg-ink px-4 text-sm font-medium text-paper"
              href="/admin/artworks/new"
            >
              <Plus className="h-4 w-4" />
              새 작품
            </Link>
            <button
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-sm border border-ink/20 px-4 text-sm text-graphite"
              onClick={handleSignOut}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
