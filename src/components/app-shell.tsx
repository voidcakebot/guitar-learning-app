import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  { tab: 'chords', label: 'Chords' },
  { tab: 'scales', label: 'Scales' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-[color:var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-6 overflow-hidden rounded-[1.8rem] border border-white/8 bg-white/[0.03] shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.34em] text-slate-400">Guitar library</p>
                <Link href="/library" className="mt-2 block display-font text-4xl leading-none text-white sm:text-5xl">Fretboard Pilot</Link>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  A focused chord and scale reference with neck positions, note sets, and interval information.
                </p>
              </div>
              <nav className="flex flex-wrap gap-2 text-sm">
                {nav.map((item) => (
                  <Link
                    key={item.tab}
                    href={`/library?tab=${item.tab}`}
                    className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-slate-200 transition hover:bg-white/6"
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
