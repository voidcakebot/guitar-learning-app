import { describe, expect, it } from 'vitest';

import { buildFretboardPositions } from '@/lib/guitar/fretboard-map';

describe('fretboard map', () => {
  it('simplifies enharmonic labels for fretboard display', () => {
    const positions = buildFretboardPositions({
      notes: ['C##', 'F##'],
      rootNote: 'C##',
      maxFret: 0,
    });

    const labels = positions.map((position) => position.label);
    expect(labels).toContain('D');
    expect(labels).toContain('G');
    expect(labels).not.toContain('C##');
    expect(labels).not.toContain('F##');
  });

  it('keeps open-position notes available at fret 0', () => {
    const positions = buildFretboardPositions({
      notes: ['E', 'A', 'D', 'G', 'B'],
      rootNote: 'E',
      maxFret: 0,
    });

    expect(positions.every((position) => position.fret === 0)).toBe(true);
    expect(positions.map((position) => position.stringNumber)).toEqual([6, 5, 4, 3, 2, 1]);
  });
});
