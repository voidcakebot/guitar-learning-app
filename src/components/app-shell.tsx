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
        <header className="mb-6 flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-4 backdrop-blur-xl sm:px-5">
          <Link href="/library?tab=chords" className="display-font text-3xl text-white sm:text-4xl">
            Fretboard Pilot
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm">
            {nav.map((item) => (
              <Link
                key={item.tab}
                href={`/library?tab=${item.tab}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-200 transition hover:bg-white/[0.06]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
