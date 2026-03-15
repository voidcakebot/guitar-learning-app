import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  { tab: 'chords', label: 'Chords' },
  { tab: 'scales', label: 'Scales' },
];

export type FrontendVariant = 'v1' | 'v2' | 'v3' | 'v4' | 'v5';

const variantTheme: Record<FrontendVariant, {
  shell: string;
  header: string;
  eyebrow: string;
  title: string;
  copy: string;
  navActive: string;
  navIdle: string;
}> = {
  v1: {
    shell: 'max-w-6xl',
    header: 'border-white/10 bg-[linear-gradient(180deg,rgba(15,14,18,0.94),rgba(7,10,16,0.94))] shadow-2xl shadow-black/25',
    eyebrow: 'text-[color:var(--muted)]',
    title: 'text-white',
    copy: 'text-[color:var(--muted)]',
    navActive: 'border-transparent bg-amber-300 text-stone-900 shadow-lg shadow-amber-400/20',
    navIdle: 'border-white/10 bg-white/[0.04] text-slate-100 hover:border-cyan-300/30 hover:bg-cyan-900/30',
  },
  v2: {
    shell: 'max-w-7xl',
    header: 'border-cyan-400/20 bg-[linear-gradient(180deg,rgba(4,16,29,0.96),rgba(3,9,20,0.96))] shadow-2xl shadow-cyan-950/25',
    eyebrow: 'text-cyan-200/70',
    title: 'text-cyan-50',
    copy: 'text-slate-300',
    navActive: 'border-cyan-300/30 bg-cyan-400/20 text-cyan-50',
    navIdle: 'border-cyan-500/15 bg-cyan-500/5 text-slate-200 hover:border-cyan-300/30 hover:bg-cyan-400/10',
  },
  v3: {
    shell: 'max-w-5xl',
    header: 'border-white/8 bg-white/[0.03] shadow-xl shadow-black/20',
    eyebrow: 'text-slate-400',
    title: 'text-white',
    copy: 'text-slate-300',
    navActive: 'border-white/10 bg-white text-slate-950',
    navIdle: 'border-white/10 bg-transparent text-slate-200 hover:bg-white/6',
  },
  v4: {
    shell: 'max-w-6xl',
    header: 'border-fuchsia-400/20 bg-[linear-gradient(180deg,rgba(32,10,33,0.95),rgba(13,8,22,0.96))] shadow-2xl shadow-fuchsia-950/30',
    eyebrow: 'text-fuchsia-200/70',
    title: 'text-fuchsia-50',
    copy: 'text-slate-300',
    navActive: 'border-fuchsia-300/20 bg-fuchsia-300/20 text-fuchsia-50',
    navIdle: 'border-fuchsia-500/15 bg-fuchsia-500/5 text-slate-200 hover:border-fuchsia-300/30 hover:bg-fuchsia-400/10',
  },
  v5: {
    shell: 'max-w-7xl',
    header: 'border-emerald-300/20 bg-[linear-gradient(180deg,rgba(8,23,18,0.96),rgba(6,13,12,0.97))] shadow-2xl shadow-emerald-950/25',
    eyebrow: 'text-emerald-100/70',
    title: 'text-emerald-50',
    copy: 'text-slate-300',
    navActive: 'border-emerald-300/20 bg-emerald-300/20 text-emerald-50',
    navIdle: 'border-emerald-500/15 bg-emerald-500/5 text-slate-200 hover:border-emerald-300/30 hover:bg-emerald-400/10',
  },
};

export function AppShell({ children, variant = 'v1' }: { children: ReactNode; variant?: FrontendVariant }) {
  const theme = variantTheme[variant];

  return (
    <div className="min-h-screen text-[color:var(--text)]">
      <div className={`mx-auto flex min-h-screen flex-col px-4 py-4 sm:px-6 lg:px-8 ${theme.shell}`}>
        <header className={`mb-6 overflow-hidden rounded-[1.8rem] border backdrop-blur-xl ${theme.header}`}>
          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className={`text-[0.65rem] uppercase tracking-[0.34em] ${theme.eyebrow}`}>Guitar library · {variant.toUpperCase()}</p>
                <Link href={`/library?variant=${variant}`} className={`mt-2 block display-font text-4xl leading-none sm:text-5xl ${theme.title}`}>Fretboard Pilot</Link>
                <p className={`mt-3 max-w-2xl text-sm leading-6 ${theme.copy}`}>
                  A focused chord and scale reference with neck positions, note sets, and interval information.
                </p>
              </div>
              <nav className="flex flex-wrap gap-2 text-sm">
                {nav.map((item) => (
                  <Link
                    key={item.tab}
                    href={`/library?tab=${item.tab}&variant=${variant}`}
                    className={`rounded-full border px-4 py-2 transition ${theme.navIdle}`}
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
