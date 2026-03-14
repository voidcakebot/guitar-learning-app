import { describe, expect, it } from 'vitest';

import { filterPositionsForWindow, getNeckPositionWindow } from '@/lib/guitar/neck-view';

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

  it('keeps 6-string positions unchanged for the custom renderer', () => {
    const window = getNeckPositionWindow('pos-3');
    const result = filterPositionsForWindow(
      [
        { stringNumber: 6, fret: 3, label: 'G', isRoot: false },
        { stringNumber: 5, fret: 4, label: 'C', isRoot: true },
        { stringNumber: 2, fret: 8, label: 'G', isRoot: false },
      ],
      window,
    );

    expect(result).toEqual([
      { stringNumber: 6, fret: 3, label: 'G', isRoot: false },
      { stringNumber: 5, fret: 4, label: 'C', isRoot: true },
    ]);
  });
});
