import { describe, expect, it } from 'vitest';
import { Chord, Note, Scale } from 'tonal';

import { formatFormula, getLibraryEntry, normalizeTonalInterval } from '@/lib/data/library';

describe('Tonal integration', () => {
  it('normalizes Tonal interval notation into guitar-friendly display labels', () => {
    expect(normalizeTonalInterval('1P')).toBe('1');
    expect(normalizeTonalInterval('3M')).toBe('3');
    expect(normalizeTonalInterval('3m')).toBe('b3');
    expect(normalizeTonalInterval('5d')).toBe('b5');
    expect(normalizeTonalInterval('4A')).toBe('#4');
    expect(normalizeTonalInterval('7m')).toBe('b7');
  });

  it('formats Tonal formulas correctly for representative chords and scales', () => {
    expect(formatFormula(Chord.get('G7').intervals)).toEqual(['1', '3', '5', 'b7']);
    expect(formatFormula(Scale.get('E blues').intervals)).toEqual(['1', 'b3', '4', 'b5', '5', 'b7']);
  });

  it('matches chord library entries to Tonal note transposition results', () => {
    const entry = getLibraryEntry('a-minor');
    if (!entry) throw new Error('missing a-minor entry');

    const expected = ['1P', '3m', '5P'].map((interval) => Note.transpose('A', interval));
    expect(entry.notes).toEqual(expected);
  });

  it('matches scale library entries to Tonal note transposition results', () => {
    const entry = getLibraryEntry('c-major-scale');
    if (!entry) throw new Error('missing c-major-scale entry');

    const expected = ['1P', '2M', '3M', '4P', '5P', '6M', '7M'].map((interval) => Note.transpose('C', interval));
    expect(entry.notes).toEqual(expected);
  });

  it('stores chord library entries with notes and formulas consistent with Tonal', () => {
    const entry = getLibraryEntry('g-dominant-7');
    if (!entry) throw new Error('missing g-dominant-7 entry');

    const tonalChord = Chord.get('G7');
    expect(entry.notes).toEqual(tonalChord.notes);
    expect(entry.formula).toEqual(formatFormula(tonalChord.intervals));
  });

  it('stores scale library entries with notes and formulas consistent with Tonal', () => {
    const entry = getLibraryEntry('e-blues-scale');
    if (!entry) throw new Error('missing e-blues-scale entry');

    const tonalScale = Scale.get('E blues');
    expect(entry.notes).toEqual(tonalScale.notes);
    expect(entry.formula).toEqual(formatFormula(tonalScale.intervals));
  });
});
