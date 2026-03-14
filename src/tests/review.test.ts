import { describe, expect, it } from 'vitest';

import { calculateNextReview } from '@/lib/domain/review';

describe('calculateNextReview', () => {
  it('boots a new card forward on good', () => {
    const next = calculateNextReview({
      dueAt: new Date('2026-03-14T00:00:00.000Z'),
      intervalDays: 0,
      easeFactor: 2.5,
      repetition: 0,
      lapses: 0,
    }, 'good');

    expect(next.intervalDays).toBe(2);
    expect(next.repetition).toBe(1);
    expect(next.easeFactor).toBe(2.5);
  });

  it('resets and increments lapses on again', () => {
    const next = calculateNextReview({
      dueAt: new Date('2026-03-14T00:00:00.000Z'),
      intervalDays: 12,
      easeFactor: 2.6,
      repetition: 4,
      lapses: 0,
    }, 'again');

    expect(next.intervalDays).toBe(1);
    expect(next.repetition).toBe(0);
    expect(next.lapses).toBe(1);
    expect(next.easeFactor).toBeLessThan(2.6);
  });
});
