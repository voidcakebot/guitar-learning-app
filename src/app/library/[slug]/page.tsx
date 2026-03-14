import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { Fretboard } from '@/components/fretboard';
import { focusOptions, getLibraryEntry } from '@/lib/data/library';
import { ensureDb, getDashboardData } from '@/lib/db/store';
import { buildFretboardPositions } from '@/lib/guitar/fretboard-map';

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

export default async function LibraryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getLibraryEntry(slug);
  if (!entry) notFound();

  await ensureDb();
  const dashboard = await getDashboardData();
  const alreadyLearning = dashboard.learningItems.find((item) => item.entry_slug === entry.slug);
  const defaultPattern = entry.patterns?.[0];
  const fretboardPositions = buildFretboardPositions({
    notes: entry.notes ?? [],
    rootNote: entry.rootNote,
    maxFret: 12,
  });
  const mutedStrings = defaultPattern?.stringFrets
    ?.map((value, index) => (value === 'x' ? 6 - index : null))
    .filter((value): value is number => value !== null)
    ?? (entry.type === 'chord' ? openChordMuteMap[entry.slug] ?? [] : []);

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="card overflow-hidden p-4 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <span className="badge">{entry.type}</span>
                <h1 className="mt-4 display-font text-4xl text-white sm:text-5xl">{entry.title}</h1>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Root {entry.rootNote ?? '—'} · Formula {entry.formula?.join(' · ') ?? '—'}
                </p>
              </div>
              <div className="grid min-w-0 gap-3 sm:min-w-64">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Root note</p>
                  <p className="mt-2 text-xl font-semibold text-white">{entry.rootNote ?? '—'}</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Primary pattern</p>
                  <p className="mt-2 text-base font-medium text-white">{defaultPattern?.name ?? 'No pattern defined yet'}</p>
                </div>
              </div>
            </div>
          </div>

          {fretboardPositions.length ? (
            <div className="card overflow-hidden p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="badge">Neck view</span>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Interactive note map for this {entry.type}, with position switching, open-string markers, and muted-string indicators.</p>
                </div>
                <span className="badge">12 frets</span>
              </div>
              <div className="mt-5">
                <Fretboard frets={12} positions={fretboardPositions} mutedStrings={mutedStrings} />
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="card p-4 sm:p-5">
              <span className="badge">Notes</span>
              <p className="mt-4 text-sm leading-7 text-white">{entry.notes?.join(', ') ?? 'Not specified yet'}</p>
            </div>
            <div className="card p-4 sm:p-5">
              <span className="badge">Fingering</span>
              <p className="mt-4 text-sm leading-7 text-white">{defaultPattern?.fingers?.map((finger) => finger ?? 'x').join(' • ') ?? 'No fingering stored yet'}</p>
            </div>
            <div className="card p-4 sm:p-5">
              <span className="badge">Tags</span>
              <p className="mt-4 text-sm leading-7 text-white">{entry.tags.join(' • ')}</p>
            </div>
          </div>

          {entry.content?.length ? (
            <div className="card">
              <span className="badge">Theory explanation</span>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {entry.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="card p-4 sm:p-6">
            <span className="badge">Add to my learning</span>
            <p className="mt-3 text-sm leading-6 text-slate-300">Capture exactly what you learned from this shape or scale so it can become part of your own practice path.</p>
            {alreadyLearning ? (
              <p className="mt-3 rounded-2xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
                Already added to your learning list.
              </p>
            ) : null}
            <form action="/api/learning-items" method="post" className="mt-4 space-y-4">
              <input type="hidden" name="entrySlug" value={entry.slug} />
              <input type="hidden" name="profileId" value={dashboard.profile.id} />
              <input type="hidden" name="visibilityMode" value="guided" />
              <div className="grid gap-3">
                {focusOptions.map((option) => {
                  const checked = (entry.recommendedFocus ?? []).includes(option.value);
                  return (
                    <label key={option.value} className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-3 gap-y-2 rounded-2xl border border-white/10 p-3 text-sm text-slate-300">
                      <input type="checkbox" name="focusAreas" value={option.value} defaultChecked={checked} className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950" />
                      <span className="min-w-0 font-medium text-white break-words">{option.label}</span>
                      <span className="col-start-2 min-w-0 text-slate-400">{option.description}</span>
                    </label>
                  );
                })}
              </div>
              <label className="block text-sm text-slate-300">
                Personal note
                <textarea name="note" rows={4} placeholder="e.g. Cleaner when I lead with finger 2 and keep the wrist relaxed" className="mt-2" />
              </label>
              <button className="button-primary w-full" type="submit">Add to learning</button>
            </form>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
