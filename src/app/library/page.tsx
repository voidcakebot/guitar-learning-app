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
      <div className="space-y-5">
        <section className="flex flex-wrap gap-2">
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
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/library/${entry.slug}`}
              className="card rounded-[1rem] p-4 transition hover:border-white/18 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="display-font text-3xl text-white">{entry.title}</h2>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-slate-300">
                  {entry.rootNote}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{entry.notes?.join(' · ')}</p>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
