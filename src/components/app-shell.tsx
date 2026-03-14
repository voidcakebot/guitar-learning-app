import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  { href: '/library', label: 'Library' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-[color:var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[1.6rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(8,25,38,0.92),rgba(6,16,26,0.88))] px-4 py-4 shadow-xl shadow-cyan-950/10 backdrop-blur-xl sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="display-font text-3xl leading-none text-[color:var(--text)] sm:text-4xl">Fretboard Pilot</Link>
            <nav className="flex items-center gap-2 text-sm">
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
