import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link className="font-serif text-xl tracking-normal text-ink focus-ring" href="/">
          One Exhibition / 단일 전시
        </Link>
        <nav className="flex items-center gap-4 text-sm text-graphite">
          <Link className="focus-ring rounded-sm hover:text-ink" href="/">
            홈
          </Link>
          <Link className="focus-ring rounded-sm hover:text-ink" href="/admin/artworks">
            관리자
          </Link>
        </nav>
      </div>
    </header>
  );
}
