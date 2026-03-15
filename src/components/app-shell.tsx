import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  { tab: 'chords', label: 'Chords' },
  { tab: 'scales', label: 'Scales' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-[color:var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(16,20,28,0.88),rgba(9,12,18,0.96))] shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="border-b border-white/8 px-5 py-4 sm:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[0.65rem] uppercase tracking-[0.34em] text-slate-500">Guitar reference atlas</p>
                <Link href="/library" className="mt-3 block display-font text-4xl leading-none text-white sm:text-6xl">
                  Fretboard Pilot
                </Link>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  A refined chord and scale reference focused on note sets, interval structure, and clear position-based neck maps.
                </p>
              </div>

              <nav className="flex flex-wrap gap-2 text-sm">
                {nav.map((item) => (
                  <Link
                    key={item.tab}
                    href={`/library?tab=${item.tab}`}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="grid gap-3 px-5 py-4 text-sm text-slate-400 sm:grid-cols-3 sm:px-7">
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Focus</p>
              <p className="mt-2 text-slate-200">Chords, scales, and practical neck positions.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Design mode</p>
              <p className="mt-2 text-slate-200">Minimal, editorial, readable.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Use case</p>
              <p className="mt-2 text-slate-200">Fast browsing while learning shapes on guitar.</p>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
