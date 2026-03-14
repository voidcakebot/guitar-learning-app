export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export type ReviewSchedule = {
  dueAt: Date;
  intervalDays: number;
  easeFactor: number;
  repetition: number;
  lapses: number;
};

export function calculateNextReview(current: ReviewSchedule, rating: ReviewRating): ReviewSchedule {
  if (rating === 'again') {
    return {
      dueAt: addDays(1),
      intervalDays: 1,
      easeFactor: Math.max(1.3, current.easeFactor - 0.2),
      repetition: 0,
      lapses: current.lapses + 1,
    };
  }

  const easeAdjustment = rating === 'hard' ? -0.05 : rating === 'easy' ? 0.15 : 0;
  const easeFactor = Math.max(1.3, current.easeFactor + easeAdjustment);

  const intervalDays = (() => {
    if (current.repetition === 0) {
      if (rating === 'hard') return 1;
      if (rating === 'easy') return 3;
      return 2;
    }

    const multiplier = rating === 'hard' ? 1.2 : rating === 'easy' ? 1.8 : 1.5;
    return Math.max(1, Math.round(current.intervalDays * easeFactor * multiplier));
  })();

  return {
    dueAt: addDays(intervalDays),
    intervalDays,
    easeFactor,
    repetition: current.repetition + 1,
    lapses: current.lapses,
  };
}

function addDays(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}
