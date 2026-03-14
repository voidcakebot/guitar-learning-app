import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { Fretboard } from '@/components/fretboard';
import { getLibraryEntry, getRelatedEntries } from '@/lib/data/library';
import { getDashboardData } from '@/lib/db/store';

export default async function LibraryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getLibraryEntry(slug);
  if (!entry) notFound();

  const dashboard = await getDashboardData();
  const alreadyLearning = dashboard.learningItems.find((item) => item.entry_slug === entry.slug);
  const defaultPattern = entry.patterns?.[0];
  const related = getRelatedEntries(entry);

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="badge">{entry.type}</span>
                <h1 className="mt-4 text-4xl font-semibold text-white">{entry.title}</h1>
                <p className="mt-3 max-w-2xl text-slate-300">{entry.summary}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4 text-sm text-slate-300">
                <p>Root: {entry.rootNote ?? '—'}</p>
                <p className="mt-2">Formula: {entry.formula?.join(' · ') ?? 'Conceptual content'}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="badge">Reference knowledge</span>
                <p className="mt-2 text-sm text-slate-300">Library facts stay global and versioned in code.</p>
              </div>
              {alreadyLearning ? <span className="badge">Already in profile</span> : null}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-sm text-slate-400">Notes</p>
                <p className="mt-2 text-white">{entry.notes?.join(', ') ?? 'N/A'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-sm text-slate-400">Default pattern</p>
                <p className="mt-2 text-white">{defaultPattern?.name ?? 'No pattern defined'}</p>
              </div>
            </div>
            {entry.content?.length ? (
              <div className="mt-4 space-y-3 rounded-2xl border border-white/10 p-4 text-sm text-slate-300">
                {entry.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            ) : null}
          </div>

          {defaultPattern?.positions?.length ? (
            <div className="card">
              <span className="badge">Visualization</span>
              <div className="mt-4">
                <Fretboard positions={defaultPattern.positions.map((position) => ({
                  stringNumber: position.stringNumber,
                  fret: position.fret,
                  label: position.interval,
                  isRoot: position.isRoot,
                }))} />
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="card">
            <span className="badge">My version</span>
            <p className="mt-3 text-sm text-slate-300">
              For this MVP, auth is intentionally minimal and everything goes into a default learning profile.
            </p>
            <form action="/api/learning-items" method="post" className="mt-4 space-y-3">
              <input type="hidden" name="entrySlug" value={entry.slug} />
              <input type="hidden" name="profileId" value={dashboard.profile.id} />
              <label className="block text-sm text-slate-300">
                Visibility mode
                <select name="visibilityMode" defaultValue="standard" className="mt-2">
                  <option value="minimal">Minimal</option>
                  <option value="standard">Standard</option>
                  <option value="expanded">Expanded</option>
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                Personal note
                <textarea name="note" rows={4} placeholder="e.g. Feels clean when I anchor the ring finger first" className="mt-2" />
              </label>
              <button className="button-primary w-full" type="submit">Add to learning profile</button>
            </form>
          </div>

          <div className="card">
            <span className="badge">Related content</span>
            <div className="mt-4 space-y-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/library/${item.slug}`} className="block rounded-2xl border border-white/10 p-4 transition hover:border-orange-400/60">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
