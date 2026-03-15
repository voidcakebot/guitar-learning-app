import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  { href: '/library?tab=chords', label: 'Chords' },
  { href: '/library?tab=scales', label: 'Scales' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-[color:var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-6 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,18,0.94),rgba(7,10,16,0.94))] shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">Guitar library</p>
                <Link href="/library" className="mt-2 block display-font text-4xl leading-none text-white sm:text-5xl">Fretboard Pilot</Link>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
                  A focused chord and scale reference with neck positions, note sets, and interval information.
                </p>
              </div>
              <nav className="flex flex-wrap gap-2 text-sm">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-100 transition hover:border-cyan-300/30 hover:bg-cyan-900/30"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
