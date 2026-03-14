import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/library', label: 'Library' },
  { href: '/review', label: 'Review' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-[color:var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(41,29,35,0.92),rgba(18,14,18,0.86))] px-5 py-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="badge">Midnight practice room</p>
              <Link href="/" className="mt-3 block display-font text-5xl leading-none text-[color:var(--text)] sm:text-6xl">Fretboard Pilot</Link>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                A warmer, more focused place to collect shapes, review what matters, and keep your guitar practice moving.
              </p>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[#f4e8dc] transition hover:border-amber-300/30 hover:bg-white/[0.06]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
