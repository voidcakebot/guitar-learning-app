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
          <span className="badge">Guitar learning app</span>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-white">Learn guitar without drowning in theory.</h1>
            <p className="max-w-2xl text-slate-300">
              Built-in guitar knowledge gives you chords, scales, and theory from day one. Your dashboard, reviews, and progress stay personal to what you actually decide to learn.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="button-primary">Open dashboard</Link>
            <Link href="/library" className="button-secondary">Browse library</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
              <p className="text-sm text-blue-200">Built-in lessons</p>
              <p className="mt-2 text-2xl font-semibold text-white">{libraryEntries.length}</p>
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
          <span className="badge">How it works</span>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• Guitar knowledge ships with the app.</li>
            <li>• Your learning list turns knowledge into personal practice items.</li>
            <li>• Flashcards are created automatically when you add something.</li>
            <li>• Reviews stay focused on what you actually learned.</li>
            <li>• The fretboard view stays front and center on detail pages.</li>
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
