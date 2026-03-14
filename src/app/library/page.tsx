import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { libraryEntries } from '@/lib/data/library';

export default function LibraryPage() {
  const grouped = {
    chord: libraryEntries.filter((entry) => entry.type === 'chord'),
    scale: libraryEntries.filter((entry) => entry.type === 'scale'),
    theory: libraryEntries.filter((entry) => entry.type === 'theory'),
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="card">
          <span className="badge">Guitar library</span>
          <h1 className="mt-4 text-3xl font-semibold text-white">Static knowledge, ready for practice</h1>
          <p className="mt-2 max-w-3xl text-slate-300">
            The app ships with built-in guitar knowledge for chords, scales, and theory. Your personal progress starts only when you add something to your learning list.
          </p>
        </div>

        {Object.entries(grouped).map(([type, entries]) => {
          const label = type === 'theory' ? 'Theory topics' : `${type.charAt(0).toUpperCase()}${type.slice(1)}s`;
          return (
            <section key={type} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">{label}</h2>
                <span className="badge">{entries.length}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {entries.map((entry) => (
                  <Link key={entry.slug} href={`/library/${entry.slug}`} className="card transition hover:border-orange-400/60">
                    <div className="flex items-center justify-between gap-3">
                      <span className="badge">{entry.type}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{entry.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{entry.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">#{tag}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
