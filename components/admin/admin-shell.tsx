'use client';

import {
  ChevronDown,
  ExternalLink,
  FileText,
  FolderKanban,
  Home,
  Images,
  LogOut,
  Tags
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import { signOutAdmin } from '@/lib/admin-artwork-store';
import type { AdminSession } from '@/lib/types';

const adminLinks = [
  { href: '/admin', label: '관리자 홈', icon: Home },
  { href: '/admin/artworks', label: '작품 관리', icon: Images },
  { href: '/admin/exhibition', label: '전시 안내', icon: FileText },
  { href: '/admin/sections', label: '섹션 관리', icon: Tags },
  { href: '/', label: '관람 화면 보기', icon: ExternalLink }
];

export function AdminShell({
  children,
  session: _session
}: {
  children: ReactNode;
  session: AdminSession;
}) {
  const router = useRouter();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  async function handleSignOut() {
    await signOutAdmin();
    router.replace('/admin/login');
  }

  return (
    <main className="min-h-screen bg-[#efeee8]">
      <header className="border-b border-ink/10 bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] gap-4 px-5 py-4 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <Link className="focus-ring order-1 inline-flex items-center gap-2 font-serif text-xl" href="/admin">
            <FolderKanban className="h-5 w-5 text-paper/70" />
            전시 관리자
          </Link>

          <nav
            aria-label="관리자 메뉴"
            className="order-3 col-span-2 flex flex-wrap gap-2 text-sm lg:order-2 lg:col-span-1 lg:justify-center"
          >
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  className="focus-ring inline-flex h-9 items-center gap-2 rounded-sm border border-paper/20 px-3 text-paper/85 transition hover:border-paper/45 hover:text-paper"
                  href={link.href}
                  key={link.href}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <AccountMenu
            isOpen={isAccountOpen}
            onSignOut={() => void handleSignOut()}
            onToggle={() => setIsAccountOpen((current) => !current)}
          />
        </div>
      </header>
      {children}
    </main>
  );
}

function AccountMenu({
  isOpen,
  onToggle,
  onSignOut
}: {
  isOpen: boolean;
  onToggle: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="relative order-2 justify-self-end lg:order-3">
      <button
        aria-expanded={isOpen}
        className="focus-ring inline-flex h-8 items-center gap-1 rounded-sm border border-paper/20 px-2 text-xs text-paper/80 transition hover:border-paper/45 hover:text-paper"
        onClick={onToggle}
        type="button"
      >
        관리자
        <ChevronDown className={`h-3.5 w-3.5 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-10 z-20 min-w-32 rounded-sm border border-ink/10 bg-paper p-1 text-ink shadow-lg">
          <button
            className="focus-ring flex h-9 w-full items-center gap-2 rounded-sm px-3 text-left text-sm hover:bg-mist"
            onClick={onSignOut}
            type="button"
          >
            <LogOut className="h-4 w-4 text-graphite" />
            로그아웃
          </button>
        </div>
      ) : null}
    </div>
  );
}
