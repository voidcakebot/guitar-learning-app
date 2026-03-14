import { describe, expect, it } from 'vitest';

import { generateFlashcards } from '@/lib/domain/flashcards';
import { getLibraryEntry } from '@/lib/data/library';

describe('generateFlashcards', () => {
  it('creates a useful starter deck for a chord entry', () => {
    const entry = getLibraryEntry('c-major');
    if (!entry) throw new Error('missing fixture');

    const cards = generateFlashcards(entry);

    expect(cards.length).toBeGreaterThanOrEqual(3);
    expect(cards.map((card) => card.type)).toContain('name_formula');
    expect(cards.map((card) => card.type)).toContain('name_notes');
  });
});
