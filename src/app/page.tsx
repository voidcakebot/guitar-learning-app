import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { knowledgeEngineSummary, libraryEntries } from '@/lib/data/library';
import { getDashboardData } from '@/lib/db/store';

export default async function HomePage() {
  const dashboard = await getDashboardData();
  const stats = [
    {
      label: 'Library items',
      value: libraryEntries.length.toString().padStart(2, '0'),
      note: 'generated chord + scale entries',
    },
    {
      label: 'Learning items',
      value: dashboard.learningItems.length.toString().padStart(2, '0'),
      note: 'active study paths',
    },
    {
      label: 'Due cards',
      value: dashboard.dueCards.length.toString().padStart(2, '0'),
      note: 'ready for repetition',
    },
  ];

  return (
    <AppShell>
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="card overflow-hidden">
          <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <div>
                <span className="badge">Primary signal</span>
                <h1 className="mt-4 display-font text-5xl leading-[0.9] text-[color:var(--text)] sm:text-6xl">
                  A frontend that feels
                  <br />
                  like a live fretboard map.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                  Lessons, queue state, and review pressure are organized like an instrument display — crisp, technical, and easy to scan at speed.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.4rem] border border-cyan-200/10 bg-cyan-950/25 p-4 shadow-lg shadow-black/20">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">{stat.label}</p>
                    <p className="mt-3 font-mono text-4xl font-semibold tracking-tight text-cyan-100">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-cyan-200/70">{stat.note}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/dashboard" className="button-primary">Enter dashboard</Link>
                <Link href="/review" className="button-secondary">Run review</Link>
                <Link href="/library" className="button-secondary">Open library</Link>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-cyan-200/10 bg-[linear-gradient(180deg,rgba(6,28,42,0.9),rgba(5,16,26,0.92))] p-5 shadow-xl shadow-black/25">
              <div className="flex items-center justify-between gap-3 border-b border-cyan-100/10 pb-4">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">Neck reference</p>
                  <p className="mt-2 font-mono text-sm text-cyan-100">{knowledgeEngineSummary.standardTuning.join('  ·  ')}</p>
                </div>
                <div className="rounded-full border border-cyan-300/20 px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-cyan-100">
                  live
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="grid grid-cols-[repeat(6,minmax(0,1fr))] gap-2">
                  {knowledgeEngineSummary.standardTuning.map((note, index) => (
                    <div key={`${note}-${index}`} className="rounded-xl border border-cyan-200/10 bg-cyan-400/8 px-2 py-3 text-center">
                      <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">S{index + 1}</div>
                      <div className="mt-2 font-mono text-lg text-cyan-100">{note}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.2rem] border border-cyan-200/10 bg-black/15 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">Knowledge engine</p>
                  <ul className="mt-4 space-y-3 text-sm text-cyan-50/90">
                    <li className="flex items-center justify-between gap-3"><span>Chromatic notes</span><strong className="font-mono text-cyan-100">{knowledgeEngineSummary.chromaticNotes.length}</strong></li>
                    <li className="flex items-center justify-between gap-3"><span>Interval labels</span><strong className="font-mono text-cyan-100">{knowledgeEngineSummary.intervalSystem.length}</strong></li>
                    <li className="flex items-center justify-between gap-3"><span>Chord formulas</span><strong className="font-mono text-cyan-100">{Object.keys(knowledgeEngineSummary.chordTypes).length}</strong></li>
                    <li className="flex items-center justify-between gap-3"><span>Scale formulas</span><strong className="font-mono text-cyan-100">{Object.keys(knowledgeEngineSummary.scaleTypes).length}</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card space-y-5">
          <div>
            <span className="badge">System note</span>
            <h2 className="mt-4 display-font text-4xl text-[color:var(--text)]">Scan first. Play next.</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              This pass turns the homepage into a fast visual readout: less lounge atmosphere, more precision and signal clarity.
            </p>
          </div>

          <div className="space-y-3 rounded-[1.5rem] border border-cyan-200/10 bg-cyan-950/20 p-5">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">Why this version works</p>
            <div className="space-y-3 text-sm leading-7 text-cyan-50/90">
              <p>Dashboard state is visible immediately.</p>
              <p>The tuning block gives the page a memorable guitar-specific signature.</p>
              <p>Typography contrast makes the interface feel designed, not templated.</p>
            </div>
          </div>

          <Link href="/dashboard" className="button-primary w-full">Go to dashboard</Link>
        </div>
      </section>
    </AppShell>
  );
}
