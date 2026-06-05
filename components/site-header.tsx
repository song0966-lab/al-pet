import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link className="font-serif text-xl tracking-normal text-ink focus-ring" href="/">
          One Exhibition
        </Link>
        <nav className="flex items-center gap-4 text-sm text-graphite">
          <Link className="focus-ring rounded-sm hover:text-ink" href="/">
            작품
          </Link>
          <Link className="focus-ring rounded-sm hover:text-ink" href="/admin/artworks">
            관리자
          </Link>
        </nav>
      </div>
    </header>
  );
}
