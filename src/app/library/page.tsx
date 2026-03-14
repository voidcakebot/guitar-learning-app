import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { libraryEntries } from '@/lib/data/library';

const tabs = [
  { key: 'scales', label: 'Scales' },
  { key: 'chords', label: 'Akkorde' },
] as const;

export default async function LibraryPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const activeTab = params.tab === 'chords' ? 'chords' : 'scales';
  const entries = libraryEntries.filter((entry) => entry.type === activeTab.slice(0, -1));

  return (
    <AppShell>
      <div className="space-y-6">
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

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {tabs.find((tab) => tab.key === activeTab)?.label}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <Link key={entry.slug} href={`/library/${entry.slug}`} className="card transition hover:border-orange-400/60">
                <div className="flex items-center justify-between gap-3">
                  <span className="badge">{entry.type}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{entry.rootNote}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{entry.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
