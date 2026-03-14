'use client';

import { useMemo, useState } from 'react';

import {
  filterPositionsForWindow,
  getNeckPositionWindow,
  neckPositionWindows,
  type NeckPositionWindowKey,
  type NeckViewPosition,
} from '@/lib/guitar/neck-view';

const strings = [6, 5, 4, 3, 2, 1] as const;
const tuningLabels: Record<number, string> = {
  6: 'E',
  5: 'A',
  4: 'D',
  3: 'G',
  2: 'B',
  1: 'E',
};

export function Fretboard({ positions, frets = 12 }: { positions: NeckViewPosition[]; frets?: number }) {
  const [activeWindowKey, setActiveWindowKey] = useState<NeckPositionWindowKey>('open');
  const activeWindow = getNeckPositionWindow(activeWindowKey);

  const visiblePositions = useMemo(() => {
    return filterPositionsForWindow(positions, activeWindow);
  }, [activeWindow, positions]);

  const fretStart = activeWindow.start;
  const fretEnd = Math.min(activeWindow.end, frets);
  const displayedFrets = Array.from({ length: fretEnd - fretStart + 1 }, (_, index) => fretStart + index);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/40">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">Neck view</p>
          <p className="text-xs text-slate-400">Choose a neck position to inspect. Nodes are labeled with note names.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {neckPositionWindows.map((window) => {
            const isActive = window.key === activeWindow.key;
            return (
              <button
                key={window.key}
                type="button"
                onClick={() => setActiveWindowKey(window.key)}
                className={isActive ? 'button-primary' : 'button-secondary'}
              >
                {window.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid min-w-[760px] gap-px rounded-[1.5rem] border border-white/10 bg-white/8 p-3"
          style={{ gridTemplateColumns: `64px repeat(${displayedFrets.length}, minmax(0, 1fr))` }}
        >
          <div className="flex items-end px-2 pb-2 text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">String</div>
          {displayedFrets.map((fret) => (
            <div key={`fret-label-${fret}`} className="flex items-end justify-center px-2 pb-2 text-xs text-slate-400">
              {fret === 0 ? 'Open' : fret}
            </div>
          ))}

          {strings.map((stringNumber) => (
            <div key={`row-${stringNumber}`} className="contents">
              <div
                key={`string-label-${stringNumber}`}
                className="flex items-center px-2 text-sm font-medium text-slate-300"
              >
                {stringNumber} · {tuningLabels[stringNumber]}
              </div>
              {displayedFrets.map((fret) => {
                const match = visiblePositions.find(
                  (position) => position.stringNumber === stringNumber && position.fret === fret,
                );
                return (
                  <div
                    key={`cell-${stringNumber}-${fret}`}
                    className="flex h-16 items-center justify-center rounded-xl border border-white/8 bg-slate-900/70"
                  >
                    {match ? (
                      <div
                        className={`flex h-10 min-w-10 items-center justify-center rounded-full px-2 text-sm font-semibold text-white shadow-lg ${
                          match.isRoot ? 'bg-orange-500' : 'bg-sky-500'
                        }`}
                      >
                        {match.label}
                      </div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-700/50" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
