import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { knowledgeEngineSummary, libraryEntries } from '@/lib/data/library';
import { getDashboardData } from '@/lib/db/store';

export default async function HomePage() {
  const dashboard = await getDashboardData();
  const stats = [
    {
      label: 'Built-in lessons',
      value: libraryEntries.length,
      accent: 'border-amber-300/20 bg-amber-400/10 text-amber-100',
    },
    {
      label: 'Learning items',
      value: dashboard.learningItems.length,
      accent: 'border-rose-300/20 bg-rose-400/10 text-rose-100',
    },
    {
      label: 'Due cards',
      value: dashboard.dueCards.length,
      accent: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100',
    },
  ];

  return (
    <AppShell>
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="card relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <span className="badge">Studio dashboard</span>
                <h1 className="mt-4 display-font text-5xl leading-[0.92] text-[color:var(--text)] sm:text-6xl">
                  Practice with a calmer room,
                  <br />
                  sharper signal,
                  <br />
                  and less clutter.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                  Your lessons, active work, and review queue are surfaced first so the next move is obvious the second you land.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-5 py-4 text-right shadow-xl shadow-black/20">
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">Standard tuning</p>
                <p className="mt-3 display-font text-4xl text-amber-100">{knowledgeEngineSummary.standardTuning.join(' · ')}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className={`rounded-[1.75rem] border p-5 shadow-lg shadow-black/20 ${stat.accent}`}>
                  <p className="text-xs uppercase tracking-[0.28em] text-current/70">{stat.label}</p>
                  <p className="mt-4 display-font text-6xl leading-none text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="button-primary">Open dashboard</Link>
              <Link href="/library" className="button-secondary">Browse library</Link>
              <Link href="/review" className="button-secondary">Start review</Link>
            </div>
          </div>
        </div>

        <div className="card space-y-5">
          <div>
            <span className="badge">Knowledge engine</span>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              Built-in theory stays close at hand, but the interface keeps it in the background until you need it.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-[color:var(--text)]/90">
            <li className="flex items-center justify-between gap-3 border-b border-white/8 pb-3"><span>Chromatic notes</span><strong>{knowledgeEngineSummary.chromaticNotes.length}</strong></li>
            <li className="flex items-center justify-between gap-3 border-b border-white/8 pb-3"><span>Interval labels</span><strong>{knowledgeEngineSummary.intervalSystem.length}</strong></li>
            <li className="flex items-center justify-between gap-3 border-b border-white/8 pb-3"><span>Chord formulas</span><strong>{Object.keys(knowledgeEngineSummary.chordTypes).length}</strong></li>
            <li className="flex items-center justify-between gap-3 border-b border-white/8 pb-3"><span>Scale formulas</span><strong>{Object.keys(knowledgeEngineSummary.scaleTypes).length}</strong></li>
          </ul>
          <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">Mood</p>
            <p className="mt-3 display-font text-3xl text-amber-50">Warm, quiet, deliberate.</p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              The app should feel like picking up a guitar in a dim practice room, not opening a spreadsheet.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
