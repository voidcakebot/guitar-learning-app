import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { libraryEntries } from '@/lib/data/library';

const tabs = [
  { key: 'chords', label: 'Chords' },
  { key: 'scales', label: 'Scales' },
] as const;

export default async function LibraryPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const activeTab = params.tab === 'scales' ? 'scales' : 'chords';
  const entries = libraryEntries.filter((entry) => entry.type === activeTab.slice(0, -1));

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="card overflow-hidden p-4 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="badge">Library</span>
              <h2 className="mt-4 display-font text-4xl text-white sm:text-5xl">
                {tabs.find((tab) => tab.key === activeTab)?.label}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Browse the catalog visually, open an entry, and inspect it on the neck with clearer position-based context.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                  <Link
                    key={tab.key}
                    href={`/library?tab=${tab.key}`}
                    className={isActive ? 'button-primary' : 'button-secondary'}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/library/${entry.slug}`}
              className="card group overflow-hidden p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/40 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="badge">{entry.type}</span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-slate-300">
                  {entry.rootNote}
                </span>
              </div>
              <h3 className="mt-5 display-font text-3xl text-white sm:text-[2rem]">{entry.title}</h3>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
                <span>{entry.notes?.join(' · ')}</span>
                <span className="text-cyan-200 transition group-hover:translate-x-0.5">Open →</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
