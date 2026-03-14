import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { libraryEntries } from '@/lib/data/library';

export default function LibraryPage() {
  const chords = libraryEntries.filter((entry) => entry.type === 'chord');
  const scales = libraryEntries.filter((entry) => entry.type === 'scale');
  const sections = [
    {
      key: 'chords',
      label: 'Chords',
      description: 'Browse generated chord reference entries across the full chromatic set.',
      entries: chords,
    },
    {
      key: 'scales',
      label: 'Scales',
      description: 'Browse generated scale reference entries across the full chromatic set.',
      entries: scales,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="card">
          <span className="badge">Tonal reference</span>
          <h1 className="mt-4 text-3xl font-semibold text-white">Browse all chords and scales</h1>
          <p className="mt-2 max-w-3xl text-slate-300">
            The library is now focused on one job: letting you browse generated chord and scale entries from Tonal.js, then add what you actually learned into your own study flow.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="badge">{chords.length} chords</span>
            <span className="badge">{scales.length} scales</span>
          </div>
        </div>

        {sections.map((section) => (
          <section key={section.key} className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{section.label}</h2>
                <p className="text-sm text-slate-300">{section.description}</p>
              </div>
              <span className="badge">{section.entries.length}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.entries.map((entry) => (
                <Link key={entry.slug} href={`/library/${entry.slug}`} className="card transition hover:border-orange-400/60">
                  <div className="flex items-center justify-between gap-3">
                    <span className="badge">{entry.type}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{entry.rootNote}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{entry.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{entry.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
