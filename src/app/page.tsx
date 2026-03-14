import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { libraryEntries } from '@/lib/data/library';
import { getDashboardData } from '@/lib/db/store';

export default async function HomePage() {
  const dashboard = await getDashboardData();

  return (
    <AppShell>
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="card space-y-5">
          <span className="badge">MVP overview</span>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-white">Learn guitar without drowning in theory.</h1>
            <p className="max-w-2xl text-slate-300">
              Fretboard Pilot keeps canonical guitar knowledge in code, then layers your actual learning state on top in Postgres.
              The result is a clean dashboard, browseable library, focused detail pages, and a lightweight review loop.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="button-primary">Open dashboard</Link>
            <Link href="/library" className="button-secondary">Browse library</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
              <p className="text-sm text-blue-200">Static library</p>
              <p className="mt-2 text-2xl font-semibold text-white">{libraryEntries.length} entries</p>
            </div>
            <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4">
              <p className="text-sm text-orange-200">Learning items</p>
              <p className="mt-2 text-2xl font-semibold text-white">{dashboard.learningItems.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-200">Due cards</p>
              <p className="mt-2 text-2xl font-semibold text-white">{dashboard.dueCards.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <span className="badge">Architecture</span>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• Next.js App Router + TypeScript + Tailwind</li>
            <li>• Static library seed data in <code>src/lib/data/library.ts</code></li>
            <li>• Dynamic profile, learning items, flashcards, and review logs in Postgres</li>
            <li>• Neon/Vercel Postgres via <code>DATABASE_URL</code> with in-memory fallback for local inspection</li>
            <li>• Vitest unit coverage and <code>bin/test-app.sh</code> for local validation</li>
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
