import { describe, expect, it } from 'vitest';

import { generateFretboardNotes } from '@/lib/music/fretboard-generator';
import { buildChordNotes } from '@/lib/music/chord-generator';
import { buildScaleNotes } from '@/lib/music/scale-generator';

describe('music engine', () => {
  it('builds chord notes from formulas', () => {
    expect(buildChordNotes('C', 'major')).toEqual(['C', 'E', 'G']);
    expect(buildChordNotes('A', 'minor')).toEqual(['A', 'C', 'E']);
  });

  it('builds scale notes from formulas', () => {
    expect(buildScaleNotes('C', 'major')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });

  it('generates fretboard notes from tuning and fret number', () => {
    const fretboard = generateFretboardNotes(2);
    expect(fretboard[0].stringNumber).toBe(6);
    expect(fretboard[0].notes.map((note) => note.note)).toEqual(['E', 'F', 'F#']);
  });
});
