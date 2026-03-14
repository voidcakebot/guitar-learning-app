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

export function Fretboard({ positions, frets = 12, mutedStrings = [] }: { positions: NeckViewPosition[]; frets?: number; mutedStrings?: number[] }) {
  const [activeWindowKey, setActiveWindowKey] = useState<NeckPositionWindowKey>('open');
  const activeWindow = getNeckPositionWindow(activeWindowKey);

  const visiblePositions = useMemo(() => {
    return filterPositionsForWindow(positions, activeWindow);
  }, [activeWindow, positions]);

  const fretStart = activeWindow.start;
  const fretEnd = Math.min(activeWindow.end, frets);
  const displayedFrets = Array.from({ length: fretEnd - fretStart + 1 }, (_, index) => fretStart + index);

  const width = 760;
  const height = 272;
  const left = 52;
  const right = width - 18;
  const top = 44;
  const bottom = height - 40;
  const stringGap = (bottom - top) / (strings.length - 1);
  const fretCount = displayedFrets.length;
  const fretGap = (right - left) / Math.max(fretCount, 1);
  const firstVisibleFret = displayedFrets[0] ?? 0;
  const isOpenWindow = firstVisibleFret === 0;

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-3 shadow-2xl shadow-slate-950/40 sm:rounded-[2rem] sm:p-4">
      <div className="mb-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-white">Neck view</p>
          <p className="text-xs leading-5 text-slate-400">6 strings, note labels directly on the strings.</p>
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

      <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[640px] w-full sm:min-w-[760px]">
          <rect x={left} y={top - 18} width={right - left} height={bottom - top + 36} rx={20} fill="#111827" stroke="#334155" />

          {strings.map((stringNumber, index) => {
            const y = top + index * stringGap;
            return (
              <g key={`string-${stringNumber}`}>
                {mutedStrings.includes(stringNumber) ? (
                  <g>
                    <line x1={left - 14} y1={y - 8} x2={left - 2} y2={y + 8} stroke="#fda4af" strokeWidth={2.5} strokeLinecap="round" />
                    <line x1={left - 14} y1={y + 8} x2={left - 2} y2={y - 8} stroke="#fda4af" strokeWidth={2.5} strokeLinecap="round" />
                  </g>
                ) : null}
                <line
                  x1={left}
                  y1={y}
                  x2={right}
                  y2={y}
                  stroke="#94a3b8"
                  strokeWidth={stringNumber >= 5 ? 3 : 2}
                />
                <text x={20} y={y + 5} textAnchor="middle" fontSize={13} fill="#e2e8f0" fontWeight={700}>
                  {stringNumber}
                </text>
                <text x={36} y={y + 5} textAnchor="middle" fontSize={11} fill="#94a3b8">
                  {tuningLabels[stringNumber]}
                </text>
              </g>
            );
          })}

          {displayedFrets.map((fret, index) => {
            const x = left + (isOpenWindow ? index : index + 1) * fretGap;
            return (
              <g key={`fret-${fret}`}>
                <line
                  x1={x}
                  y1={top - 10}
                  x2={x}
                  y2={bottom + 10}
                  stroke={index === 0 && !isOpenWindow ? '#e2e8f0' : '#475569'}
                  strokeWidth={index === 0 && !isOpenWindow ? 6 : 3}
                />
                <text x={isOpenWindow ? left + index * fretGap + fretGap * 0.5 : left + index * fretGap + fretGap * 0.5} y={height - 10} textAnchor="middle" fontSize={11} fill="#94a3b8">
                  {fret === 0 ? 'Open' : fret}
                </text>
              </g>
            );
          })}

          {visiblePositions.map((position) => {
            const stringIndex = strings.findIndex((value) => value === position.stringNumber);
            if (stringIndex < 0) return null;

            const y = top + stringIndex * stringGap;
            let x = left + fretGap * 0.5;

            if (isOpenWindow) {
              x = position.fret === 0
                ? left - fretGap * 0.28
                : left + position.fret * fretGap - fretGap * 0.5;
            } else {
              x = left + (position.fret - firstVisibleFret) * fretGap + fretGap * 0.5;
            }

            return (
              <g key={`${position.stringNumber}-${position.fret}-${position.label}`}>
                <circle cx={x} cy={y} r={16} fill={position.isRoot ? '#f97316' : '#0ea5e9'} stroke="rgba(255,255,255,0.24)" strokeWidth={2} />
                <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
                  {position.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
