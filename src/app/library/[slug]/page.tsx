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
      <div className="space-y-8">
        <section className="card overflow-hidden p-5 sm:p-7">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{entry.type}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-slate-300">
                  Root {entry.rootNote ?? '—'}
                </span>
              </div>
              <h1 className="mt-5 display-font text-4xl text-white sm:text-5xl lg:text-6xl">{entry.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{entry.summary}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Notes</p>
                <p className="mt-3 text-lg font-semibold text-white">{entry.notes?.join(' · ') ?? '—'}</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{entry.type === 'chord' ? 'Intervals' : 'Scale info'}</p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {entry.type === 'chord'
                    ? entry.formula?.join(' · ') ?? '—'
                    : `Root ${entry.rootNote ?? '—'} · ${entry.scaleType ?? 'Scale'}`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {fretboardPositions.length ? (
          <section className="card overflow-hidden p-5 sm:p-7">
            <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="badge">Neck view</span>
                <h2 className="mt-4 display-font text-3xl text-white sm:text-4xl">Shape positions</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Move through focused neck positions to see this {entry.type} as clear, compact shapes instead of one overloaded full-neck map.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Range</p>
                <p className="mt-2 font-semibold text-white">Open position + 12 frets</p>
              </div>
            </div>
            <div className="mt-6">
              <Fretboard frets={12} positions={fretboardPositions} mutedStrings={mutedStrings} />
            </div>
          </section>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card p-5 sm:p-6">
            <span className="badge">{entry.type === 'chord' ? 'Playable note set' : 'Scale tones'}</span>
            <p className="mt-5 text-base leading-8 text-white">{entry.notes?.join(', ') ?? 'No notes available.'}</p>
          </div>

          {entry.type === 'chord' ? (
            <div className="card p-5 sm:p-6">
              <span className="badge">Interval structure</span>
              <p className="mt-5 text-base leading-8 text-white">{entry.formula?.join(', ') ?? 'No intervals available.'}</p>
            </div>
          ) : (
            <div className="card p-5 sm:p-6">
              <span className="badge">Reference</span>
              <p className="mt-5 text-base leading-8 text-white">This scale is shown as a neck-position reference so you can study note grouping and root placement directly on the fretboard.</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
