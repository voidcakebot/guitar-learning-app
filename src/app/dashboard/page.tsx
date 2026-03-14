import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { getDashboardData } from '@/lib/db/store';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <AppShell>
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="card">
            <span className="badge">Profile</span>
            <h1 className="mt-4 text-3xl font-semibold text-white">{data.profile.name}</h1>
            <p className="mt-2 text-sm text-slate-300">{data.profile.description ?? 'Your focused learning space.'}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-sm text-slate-400">Learning items</p>
                <p className="mt-1 text-2xl font-semibold text-white">{data.learningItems.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-sm text-slate-400">Due now</p>
                <p className="mt-1 text-2xl font-semibold text-white">{data.dueCards.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="badge">Recommendations</span>
                <p className="mt-2 text-sm text-slate-300">Next useful unlocks from the canonical library.</p>
              </div>
              <Link href="/library" className="button-secondary">Open library</Link>
            </div>
            <div className="mt-4 space-y-3">
              {data.recommendations.map((entry) => (
                <Link key={entry.slug} href={`/library/${entry.slug}`} className="block rounded-2xl border border-white/10 p-4 transition hover:border-orange-400/60">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{entry.title}</p>
                      <p className="text-sm text-slate-400">{entry.summary}</p>
                    </div>
                    <span className="badge">{entry.type}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="badge">My learning items</span>
              <p className="mt-2 text-sm text-slate-300">Library entries become personalized items once you start learning them.</p>
            </div>
            <Link href="/review" className="button-primary">Start review</Link>
          </div>
          <div className="mt-5 space-y-4">
            {data.learningItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-400">
                No learning items yet. Open the library and add your first chord or scale.
              </div>
            ) : (
              data.learningItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{item.entryTitle}</p>
                      <p className="text-sm text-slate-400">{item.entryType} · {item.visibility_mode} visibility</p>
                    </div>
                    <span className="badge">{item.status}</span>
                  </div>
                  {item.notes ? <p className="mt-3 text-sm text-slate-300">{item.notes}</p> : null}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
