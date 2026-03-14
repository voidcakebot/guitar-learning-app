import { describe, expect, it } from 'vitest';

import { generateFlashcards } from '@/lib/domain/flashcards';
import { getLibraryEntry } from '@/lib/data/library';

describe('generateFlashcards', () => {
  it('creates a richer starter deck for a chord entry', () => {
    const entry = getLibraryEntry('c-major');
    if (!entry) throw new Error('missing fixture');

    const cards = generateFlashcards(entry);
    const types = cards.map((card) => card.type);

    expect(cards.length).toBeGreaterThanOrEqual(4);
    expect(types).toContain('diagram_to_name');
    expect(types).toContain('name_to_formula');
    expect(types).toContain('name_to_notes');
    expect(types).toContain('identify_root');
  });

  it('creates scale-specific cards for a scale entry', () => {
    const entry = getLibraryEntry('minor-pentatonic-a');
    if (!entry) throw new Error('missing fixture');

    const cards = generateFlashcards(entry);
    const types = cards.map((card) => card.type);

    expect(types).toContain('pattern_to_name');
    expect(types).toContain('name_to_intervals');
  });
});
