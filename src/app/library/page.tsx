import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { libraryEntries } from '@/lib/library';

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
      <div className="space-y-8">
        <section className="card overflow-hidden p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="badge">Library</span>
              <h2 className="mt-4 display-font text-4xl text-white sm:text-5xl lg:text-6xl">
                {tabs.find((tab) => tab.key === activeTab)?.label}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-[0.98rem]">
                Browse a quieter, cleaner library designed to make note sets, interval structure, and position shapes easier to scan.
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

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="card p-5 sm:p-6">
            <span className="badge">Collection overview</span>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.02] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Entries shown</p>
                <p className="mt-3 text-3xl font-semibold text-white">{entries.length}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.02] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Type</p>
                <p className="mt-3 text-3xl font-semibold text-white capitalize">{activeTab}</p>
              </div>
            </div>
            <div className="mt-5 rounded-[1.25rem] border border-white/8 bg-white/[0.02] p-4 text-sm leading-7 text-slate-300">
              Each entry opens into a position-based neck map plus the most important theory details for quick practice reference.
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {entries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/library/${entry.slug}`}
                className="card group overflow-hidden rounded-[1.1rem] bg-white/[0.02] p-5 transition hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="badge">{entry.type}</span>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-slate-300">
                    {entry.rootNote}
                  </span>
                </div>
                <h3 className="mt-5 display-font text-3xl text-white">{entry.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{entry.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(entry.tags ?? []).slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] text-slate-200">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
                  <span className="truncate pr-3">{entry.notes?.join(' · ')}</span>
                  <span className="text-slate-100 transition group-hover:translate-x-0.5">Open →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
