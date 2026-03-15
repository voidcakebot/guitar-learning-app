import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { Fretboard } from '@/components/fretboard';
import { focusOptions, getLibraryEntry, getNextSteps, getRelatedEntries } from '@/lib/data/library';
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
  const relatedEntries = getRelatedEntries(entry);
  const nextSteps = getNextSteps(entry);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="card overflow-hidden p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{entry.type}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-slate-300">
                  Root {entry.rootNote ?? '—'}
                </span>
                <span className="rounded-full border border-amber-300/15 bg-amber-400/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-amber-100/90">
                  {entry.quality ?? entry.scaleType ?? 'Reference'}
                </span>
              </div>
              <h1 className="mt-5 display-font text-4xl text-white sm:text-5xl lg:text-6xl">{entry.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-[0.98rem]">
                {entry.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(entry.tags ?? []).slice(0, 6).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-3 xl:min-w-[28rem] xl:grid-cols-1">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Formula</p>
                <p className="mt-2 text-lg font-semibold text-white">{entry.formula?.join(' · ') ?? '—'}</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Note set</p>
                <p className="mt-2 text-lg font-semibold text-white">{entry.notes?.join(' · ') ?? '—'}</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Primary shape</p>
                <p className="mt-2 text-base font-semibold text-white">{defaultPattern?.name ?? 'Generated neck map'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
          <div className="space-y-6">
            {fretboardPositions.length ? (
              <div className="card overflow-hidden p-4 sm:p-6">
                <div className="flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="badge">Neck view</span>
                    <h2 className="mt-4 display-font text-3xl text-white sm:text-4xl">Practice the shape on the neck</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                      The view below is optimized for position-based practice: roots are highlighted, windows stay focused, and open or muted strings remain easy to spot.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:min-w-[16rem]">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-slate-300">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Coverage</p>
                      <p className="mt-2 font-semibold text-white">12 frets</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-slate-300">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Root</p>
                      <p className="mt-2 font-semibold text-white">{entry.rootNote ?? '—'}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <Fretboard frets={12} positions={fretboardPositions} mutedStrings={mutedStrings} />
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-3">
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
              <div className="card p-5 sm:p-6">
                <span className="badge">Theory explanation</span>
                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                  {entry.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </div>
            ) : null}

            {(relatedEntries.length || nextSteps.length) ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="card p-5 sm:p-6">
                  <span className="badge">Related shapes</span>
                  <div className="mt-4 space-y-3">
                    {relatedEntries.length ? relatedEntries.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/library/${related.slug}`}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-500/5"
                      >
                        <span>{related.title}</span>
                        <span className="text-cyan-200">Open →</span>
                      </Link>
                    )) : <p className="text-sm text-slate-400">No related entries yet.</p>}
                  </div>
                </div>

                <div className="card p-5 sm:p-6">
                  <span className="badge">Next step</span>
                  <div className="mt-4 space-y-3">
                    {nextSteps.length ? nextSteps.map((step) => (
                      <Link
                        key={step.slug}
                        href={`/library/${step.slug}`}
                        className="block rounded-2xl border border-amber-300/15 bg-amber-400/10 px-4 py-4 text-sm text-amber-50 transition hover:border-amber-200/30 hover:bg-amber-300/14"
                      >
                        <p className="font-semibold">{step.title}</p>
                        <p className="mt-1 text-amber-50/80">Keep momentum by comparing this entry with the next nearby shape.</p>
                      </Link>
                    )) : <p className="text-sm text-slate-400">No suggested next step yet.</p>}
                  </div>
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
                        <span className="min-w-0 break-words font-medium text-white">{option.label}</span>
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
        </section>
      </div>
    </AppShell>
  );
}
