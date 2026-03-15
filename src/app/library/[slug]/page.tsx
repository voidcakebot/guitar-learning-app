import { notFound } from 'next/navigation';

import { AppShell, type FrontendVariant } from '@/components/app-shell';
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

const validVariants: FrontendVariant[] = ['v1', 'v2', 'v3', 'v4', 'v5'];

export default async function LibraryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ variant?: string }>;
}) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const variant = validVariants.includes(query.variant as FrontendVariant) ? (query.variant as FrontendVariant) : 'v1';
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

  const infoPrimary = (
    <div className="card overflow-hidden p-4 sm:p-6 lg:p-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">{entry.type}</span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-slate-300">Root {entry.rootNote ?? '—'}</span>
          </div>
          <h1 className="mt-5 display-font text-4xl text-white sm:text-5xl lg:text-6xl">{entry.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{entry.summary}</p>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:min-w-[26rem]">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Notes</p>
            <p className="mt-2 text-lg font-semibold text-white">{entry.notes?.join(' · ') ?? '—'}</p>
          </div>
          {entry.type === 'chord' ? (
            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Intervals</p>
              <p className="mt-2 text-lg font-semibold text-white">{entry.formula?.join(' · ') ?? '—'}</p>
            </div>
          ) : (
            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Scale info</p>
              <p className="mt-2 text-lg font-semibold text-white">Root {entry.rootNote ?? '—'} · {entry.scaleType ?? 'Scale'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const neck = fretboardPositions.length ? (
    <section className="card overflow-hidden p-4 sm:p-6">
      <div className="flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="badge">Neck view</span>
          <h2 className="mt-4 display-font text-3xl text-white sm:text-4xl">Positions on the neck</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Switch between positions to inspect where this {entry.type} appears across the neck.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Coverage</p>
          <p className="mt-2 font-semibold text-white">12 frets</p>
        </div>
      </div>
      <div className="mt-5">
        <Fretboard frets={12} positions={fretboardPositions} mutedStrings={mutedStrings} variant={variant} />
      </div>
    </section>
  ) : null;

  const infoCards = (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="card p-5 sm:p-6">
        <span className="badge">{entry.type === 'chord' ? 'Chord notes' : 'Scale notes'}</span>
        <p className="mt-4 text-base leading-8 text-white">{entry.notes?.join(', ') ?? 'No notes available.'}</p>
      </div>
      {entry.type === 'chord' ? (
        <div className="card p-5 sm:p-6">
          <span className="badge">Intervals</span>
          <p className="mt-4 text-base leading-8 text-white">{entry.formula?.join(', ') ?? 'No intervals available.'}</p>
        </div>
      ) : (
        <div className="card p-5 sm:p-6">
          <span className="badge">Scale info</span>
          <p className="mt-4 text-base leading-8 text-white">Root {entry.rootNote ?? '—'} · {entry.scaleType ?? 'Scale'}</p>
        </div>
      )}
    </section>
  );

  return (
    <AppShell variant={variant}>
      {variant === 'v2' ? (
        <div className="space-y-4">
          {infoPrimary}
          {infoCards}
          {neck}
        </div>
      ) : variant === 'v3' ? (
        <div className="space-y-8">
          {infoPrimary}
          {neck}
          {infoCards}
        </div>
      ) : variant === 'v4' ? (
        <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-6">{infoPrimary}{infoCards}</div>
          <div>{neck}</div>
        </div>
      ) : variant === 'v5' ? (
        <div className="space-y-5">
          {neck}
          {infoPrimary}
          {infoCards}
        </div>
      ) : (
        <div className="space-y-6">
          {infoPrimary}
          {neck}
          {infoCards}
        </div>
      )}
    </AppShell>
  );
}
