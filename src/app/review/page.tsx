import { AppShell } from '@/components/app-shell';
import { getDueReviewCards } from '@/lib/db/store';

const ratings = ['again', 'hard', 'good', 'easy'] as const;

export default async function ReviewPage() {
  const cards = await getDueReviewCards();
  const current = cards[0];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="card">
          <span className="badge">Review queue</span>
          <h1 className="mt-4 text-3xl font-semibold text-white">{cards.length} card{cards.length === 1 ? '' : 's'} ready</h1>
          <p className="mt-2 text-sm text-slate-300">The MVP review loop uses a simplified SM-2 style scheduler.</p>
        </div>

        {!current ? (
          <div className="card text-center text-slate-300">No cards are due yet. Add a library entry to your profile first.</div>
        ) : (
          <div className="card space-y-6">
            <div>
              <p className="text-sm text-slate-400">Prompt</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{current.prompt}</h2>
            </div>
            <details className="rounded-2xl border border-white/10 p-4">
              <summary className="cursor-pointer text-sm text-slate-200">Reveal answer</summary>
              <p className="mt-3 text-lg text-white">{current.answer}</p>
            </details>
            <form action="/api/review" method="post" className="grid gap-3 sm:grid-cols-4">
              <input type="hidden" name="flashcardId" value={current.id} />
              {ratings.map((rating) => (
                <button key={rating} name="rating" value={rating} className="button-secondary capitalize" type="submit">
                  {rating}
                </button>
              ))}
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
