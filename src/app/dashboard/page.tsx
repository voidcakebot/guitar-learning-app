import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { getBeginnerEntries } from '@/lib/data/library';
import { getDashboardData } from '@/lib/db/store';

export default async function DashboardPage() {
  const data = await getDashboardData();
  const recentlyLearned = data.learningItems.slice(0, 3);
  const nextRecommended = data.recommendations[0] ?? null;
  const beginnerChoices = getBeginnerEntries().slice(0, 3);

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="card">
              <span className="badge">Your practice space</span>
              <h1 className="mt-4 text-3xl font-semibold text-white">{data.profile.name}</h1>
              <p className="mt-2 text-sm text-slate-300">{data.profile.description ?? 'A focused place to build real guitar skills, one shape at a time.'}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Learning items</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{data.learningItems.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Due today</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{data.dueCards.length}</p>
                </div>
              </div>
            </div>

            {data.learningItems.length === 0 ? (
              <div className="card">
                <span className="badge">Start here</span>
                <h2 className="mt-4 text-2xl font-semibold text-white">Start learning your first chord</h2>
                <p className="mt-2 text-sm text-slate-300">Pick one beginner-friendly shape and the app will create your learning item and starter flashcards automatically.</p>
                <div className="mt-5 grid gap-3">
                  {beginnerChoices.map((entry) => (
                    <form key={entry.slug} action="/api/learning-items" method="post" className="rounded-2xl border border-white/10 p-4 transition hover:border-orange-400/60">
                      <input type="hidden" name="profileId" value={data.profile.id} />
                      <input type="hidden" name="entrySlug" value={entry.slug} />
                      <input type="hidden" name="visibilityMode" value="guided" />
                      <input type="hidden" name="focusAreas" value={entry.recommendedFocus?.join(',') ?? ''} />
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">Learn {entry.title}</p>
                          <p className="text-sm text-slate-400">{entry.summary}</p>
                        </div>
                        <button className="button-primary" type="submit">Start</button>
                      </div>
                    </form>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="badge">Recommended next step</span>
                    <p className="mt-2 text-sm text-slate-300">Keep momentum by moving into the next useful concept.</p>
                  </div>
                  <Link href="/library" className="button-secondary">Browse library</Link>
                </div>
                {nextRecommended ? (
                  <Link href={`/library/${nextRecommended.slug}`} className="mt-4 block rounded-2xl border border-white/10 p-4 transition hover:border-orange-400/60">
                    <p className="font-medium text-white">{nextRecommended.title}</p>
                    <p className="text-sm text-slate-400">{nextRecommended.summary}</p>
                  </Link>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">You have already started everything in the current beginner library.</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="badge">Today</span>
                  <p className="mt-2 text-sm text-slate-300">Your current review load and learning momentum.</p>
                </div>
                <Link href="/review" className="button-primary">Start review</Link>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Due today</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{data.dueCards.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Recently learned</p>
                  <p className="mt-1 text-lg font-semibold text-white">{recentlyLearned[0]?.entryTitle ?? 'Nothing yet'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Next recommended</p>
                  <p className="mt-1 text-lg font-semibold text-white">{nextRecommended?.title ?? 'Keep reviewing'}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="badge">Continue learning</span>
                  <p className="mt-2 text-sm text-slate-300">Everything you have already started, with its current learning focus.</p>
                </div>
                <Link href="/library" className="button-secondary">Add more</Link>
              </div>
              <div className="mt-5 space-y-4">
                {data.learningItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-400">
                    Your dashboard comes alive as soon as you start the first chord.
                  </div>
                ) : (
                  data.learningItems.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{item.entryTitle}</p>
                          <p className="text-sm text-slate-400">{item.entryType} • {item.focus_summary || 'General practice focus'}</p>
                        </div>
                        <span className="badge">{item.status}</span>
                      </div>
                      {item.notes ? <p className="mt-3 text-sm text-slate-300">{item.notes}</p> : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
