import { describe, expect, it } from 'vitest';

import { filterPositionsForWindow, getNeckPositionWindow, mapToFretboardJsDots } from '@/lib/guitar/neck-view';

describe('neck-view helpers', () => {
  it('filters positions by the selected neck window', () => {
    const window = getNeckPositionWindow('open');
    const result = filterPositionsForWindow(
      [
        { stringNumber: 6, fret: 0, label: 'E' },
        { stringNumber: 5, fret: 3, label: 'C' },
        { stringNumber: 4, fret: 7, label: 'A' },
      ],
      window,
    );

    expect(result).toEqual([
      { stringNumber: 6, fret: 0, label: 'E' },
      { stringNumber: 5, fret: 3, label: 'C' },
    ]);
  });

  it('maps positions to fretboard.js dot coordinates without reversing strings', () => {
    const dots = mapToFretboardJsDots([
      { stringNumber: 6, fret: 3, label: 'G', isRoot: false },
      { stringNumber: 5, fret: 1, label: 'C', isRoot: true },
    ]);

    expect(dots).toEqual([
      expect.objectContaining({ string: 6, fret: 3, note: 'G', fill: '#0ea5e9' }),
      expect.objectContaining({ string: 5, fret: 1, note: 'C', fill: '#f97316' }),
    ]);
  });
});
