import { notFound } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { Fretboard } from '@/components/fretboard';
import { getLibraryEntry } from '@/lib/library';
import { buildFretboardPositions } from '@/lib/fretboard-map';

const openChordMuteMap: Record<string, number[]> = {
  'c-major': [6],
  'c-major-7': [6],
  'd-major': [6, 5],
  'd-minor': [6, 5],
  'a-major': [6],
  'a-minor': [6],
  'e-major': [],
  'e-minor': [],
  'g-major': [],
  'g-dominant-7': [5],
};

export default async function LibraryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getLibraryEntry(slug);
  if (!entry) notFound();

  const fretboardPositions = buildFretboardPositions({
    notes: entry.notes ?? [],
    rootNote: entry.rootNote,
    maxFret: 12,
  });

  const defaultPattern = entry.patterns?.[0];
  const mutedStrings = defaultPattern?.stringFrets
    ?.map((value, index) => (value === 'x' ? 6 - index : null))
    .filter((value): value is number => value !== null)
    ?? (entry.type === 'chord' ? openChordMuteMap[entry.slug] ?? [] : []);

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="card rounded-[1rem] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="display-font text-4xl text-white sm:text-5xl">{entry.title}</h1>
              <p className="mt-3 text-sm text-slate-300">{entry.notes?.join(' · ') ?? '—'}</p>
            </div>
            {entry.type === 'chord' ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white">
                {entry.formula?.join(' · ') ?? '—'}
              </div>
            ) : null}
          </div>
        </section>

        {fretboardPositions.length ? <Fretboard frets={12} positions={fretboardPositions} mutedStrings={mutedStrings} /> : null}
      </div>
    </AppShell>
  );
}
