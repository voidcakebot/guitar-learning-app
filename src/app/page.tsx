import Link from 'next/link';

import type { FrontendVariant } from '@/components/app-shell';

const variants: Array<{ key: FrontendVariant; name: string; vibe: string; accent: string; preview: string }> = [
  { key: 'v1', name: 'Warm Studio', vibe: 'Current premium dark guitar look', accent: 'from-amber-200 via-orange-400 to-amber-600', preview: 'Rich, polished, familiar' },
  { key: 'v2', name: 'Neon Night', vibe: 'Cold cyan performance UI', accent: 'from-cyan-200 via-sky-400 to-cyan-700', preview: 'Sharper, more technical' },
  { key: 'v3', name: 'Minimal Mono', vibe: 'Quiet editorial reference tool', accent: 'from-zinc-100 via-slate-300 to-zinc-500', preview: 'Clean, reduced, calm' },
  { key: 'v4', name: 'Stage Glow', vibe: 'Purple-magenta modern app', accent: 'from-fuchsia-200 via-fuchsia-400 to-purple-700', preview: 'Bold, playful, high contrast' },
  { key: 'v5', name: 'Forest Jazz', vibe: 'Deep green instrument-library mood', accent: 'from-emerald-200 via-emerald-400 to-teal-700', preview: 'Organic, premium, distinct' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="card overflow-hidden p-6 sm:p-8 lg:p-10">
          <span className="badge">Frontend test page</span>
          <h1 className="mt-5 display-font text-5xl text-white sm:text-6xl">Choose the direction you like most</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            I built five different frontend directions for the same guitar library so you can click through them and decide which visual style should become the main app.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {variants.map((variant) => (
            <div key={variant.key} className="card flex h-full flex-col p-4 sm:p-5">
              <div className={`h-2 rounded-full bg-gradient-to-r ${variant.accent}`} />
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="badge">{variant.key.toUpperCase()}</span>
                <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Preview</span>
              </div>
              <h2 className="mt-4 display-font text-3xl text-white">{variant.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{variant.vibe}</p>
              <p className="mt-3 text-sm font-medium text-slate-200">{variant.preview}</p>
              <div className="mt-5 flex flex-col gap-2">
                <Link href={`/library?tab=chords&variant=${variant.key}`} className="button-primary w-full">
                  Test chords
                </Link>
                <Link href={`/library?tab=scales&variant=${variant.key}`} className="button-secondary w-full">
                  Test scales
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
