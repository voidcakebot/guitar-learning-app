import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  { href: '/library', label: 'Library' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-[color:var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-[1.9rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(10,34,49,0.94),rgba(7,18,29,0.9))] px-5 py-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <p className="badge">Library mode</p>
                <span className="text-[0.7rem] uppercase tracking-[0.32em] text-[color:var(--muted)]">guitar knowledge browser</span>
              </div>
              <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
                <Link href="/library" className="display-font text-5xl leading-none text-[color:var(--text)] sm:text-6xl">Fretboard Pilot</Link>
                <p className="max-w-md text-sm leading-6 text-[color:var(--muted)]">
                  A focused guitar library for browsing generated chord and scale knowledge from Tonal.js.
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-cyan-100/10 bg-cyan-950/30 px-4 py-2 text-cyan-50 transition hover:border-cyan-300/30 hover:bg-cyan-900/40"
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
