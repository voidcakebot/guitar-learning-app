import Link from 'next/link';

import { AppShell, type FrontendVariant } from '@/components/app-shell';
import { libraryEntries } from '@/lib/library';

const tabs = [
  { key: 'chords', label: 'Chords' },
  { key: 'scales', label: 'Scales' },
] as const;

const validVariants: FrontendVariant[] = ['v1', 'v2', 'v3', 'v4', 'v5'];

const variantCardStyles: Record<FrontendVariant, string> = {
  v1: 'hover:border-cyan-300/40',
  v2: 'border-cyan-400/15 bg-cyan-500/[0.03] hover:border-cyan-300/40 rounded-xl',
  v3: 'bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] rounded-lg',
  v4: 'border-fuchsia-400/15 bg-fuchsia-500/[0.03] hover:border-fuchsia-300/35 rounded-[1.8rem]',
  v5: 'border-emerald-400/15 bg-emerald-500/[0.03] hover:border-emerald-300/35 rounded-[1.2rem]',
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string; variant?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const activeTab = params.tab === 'scales' ? 'scales' : 'chords';
  const variant = validVariants.includes(params.variant as FrontendVariant) ? (params.variant as FrontendVariant) : 'v1';
  const entries = libraryEntries.filter((entry) => entry.type === activeTab.slice(0, -1));

  const hero = (
    <section className="card overflow-hidden p-4 sm:p-6 lg:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="badge">Library</span>
          <h2 className="mt-4 display-font text-4xl text-white sm:text-5xl lg:text-6xl">
            {tabs.find((tab) => tab.key === activeTab)?.label}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-[0.98rem]">
            Compare five actual layout directions and choose the one that feels best for browsing chords, scales, and neck positions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <Link
                key={tab.key}
                href={`/library?tab=${tab.key}&variant=${variant}`}
                className={isActive ? 'button-primary' : 'button-secondary'}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );

  const cards = entries.map((entry) => (
    <Link
      key={entry.slug}
      href={`/library/${entry.slug}?variant=${variant}`}
      className={`card group overflow-hidden p-4 transition hover:-translate-y-1 sm:p-5 ${variantCardStyles[variant]}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="badge">{entry.type}</span>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-slate-300">{entry.rootNote}</span>
      </div>
      <h3 className="mt-5 display-font text-3xl text-white sm:text-[2rem]">{entry.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{entry.summary}</p>
      {variant !== 'v2' ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {(entry.tags ?? []).slice(0, variant === 'v3' ? 2 : 4).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] text-slate-200">#{tag}</span>
          ))}
        </div>
      ) : null}
      <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
        <span className={variant === 'v2' ? 'truncate' : ''}>{variant === 'v4' ? entry.notes?.slice(0, 4).join(' · ') : entry.notes?.join(' · ')}</span>
        <span className="text-cyan-200 transition group-hover:translate-x-0.5">Open →</span>
      </div>
    </Link>
  ));

  return (
    <AppShell variant={variant}>
      {variant === 'v2' ? (
        <div className="space-y-4">
          {hero}
          <section className="card p-3 sm:p-4">
            <div className="space-y-3">
              {cards}
            </div>
          </section>
        </div>
      ) : variant === 'v3' ? (
        <div className="space-y-8">
          {hero}
          <section className="grid gap-6 md:grid-cols-2">{cards}</section>
        </div>
      ) : variant === 'v4' ? (
        <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <div>{hero}</div>
          <section className="grid gap-4 md:grid-cols-2">{cards}</section>
        </div>
      ) : variant === 'v5' ? (
        <div className="space-y-5">
          {hero}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards}</section>
        </div>
      ) : (
        <div className="space-y-6">
          {hero}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards}</section>
        </div>
      )}
    </AppShell>
  );
}
