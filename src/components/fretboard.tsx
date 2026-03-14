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

function stringStrokeWidth(stringNumber: number) {
  if (stringNumber >= 5) return 3.6;
  if (stringNumber >= 3) return 2.6;
  return 1.8;
}

function stringOpacity(stringNumber: number) {
  if (stringNumber >= 5) return 0.95;
  if (stringNumber >= 3) return 0.82;
  return 0.72;
}

export function Fretboard({ positions, frets = 12, mutedStrings = [] }: { positions: NeckViewPosition[]; frets?: number; mutedStrings?: number[] }) {
  const [activeWindowKey, setActiveWindowKey] = useState<NeckPositionWindowKey>('open');
  const activeWindow = getNeckPositionWindow(activeWindowKey);

  const visiblePositions = useMemo(() => {
    return filterPositionsForWindow(positions, activeWindow);
  }, [activeWindow, positions]);

  const fretStart = activeWindow.start;
  const fretEnd = Math.min(activeWindow.end, frets);
  const displayedFrets = Array.from({ length: fretEnd - fretStart + 1 }, (_, index) => fretStart + index);
  const firstVisibleFret = displayedFrets[0] ?? 0;
  const isOpenWindow = firstVisibleFret === 0;

  const width = 760;
  const height = 286;
  const left = 62;
  const right = width - 18;
  const top = 56;
  const bottom = height - 48;
  const stringGap = (bottom - top) / (strings.length - 1);
  const fretGap = (right - left) / Math.max(displayedFrets.length, 1);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,15,24,0.95),rgba(5,10,18,0.96))] p-3 shadow-2xl shadow-slate-950/50 sm:rounded-[2rem] sm:p-4">
      <div className="mb-4 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white">Fretboard</p>
            <p className="text-xs leading-5 text-slate-400">6-string neck view with note labels directly on the strings, plus open and muted markers.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-slate-300">
            {isOpenWindow ? 'Open position' : `Position ${activeWindow.label}`}
          </div>
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
          <defs>
            <linearGradient id="neck-wood" x1="0" x2="1">
              <stop offset="0%" stopColor="#3a2417" />
              <stop offset="45%" stopColor="#6c452d" />
              <stop offset="100%" stopColor="#4a2e1e" />
            </linearGradient>
            <linearGradient id="fret-metal" x1="0" x2="1">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          <rect x={left} y={top - 24} width={right - left} height={bottom - top + 48} rx={22} fill="url(#neck-wood)" stroke="#7c5236" strokeWidth="2" />
          <rect x={left - 8} y={top - 28} width={10} height={bottom - top + 56} rx={5} fill="#f1f5f9" opacity={isOpenWindow ? 1 : 0.12} />

          {displayedFrets.map((fret, index) => {
            const x = left + (isOpenWindow ? index : index + 1) * fretGap;
            const labelX = isOpenWindow
              ? left + index * fretGap + fretGap * 0.5
              : left + index * fretGap + fretGap * 0.5;

            return (
              <g key={`fret-${fret}`}>
                <line
                  x1={x}
                  y1={top - 16}
                  x2={x}
                  y2={bottom + 16}
                  stroke="url(#fret-metal)"
                  strokeWidth={index === 0 && !isOpenWindow ? 6 : 4}
                />
                <text x={labelX} y={height - 14} textAnchor="middle" fontSize={11} fill="#cbd5e1">
                  {fret === 0 ? 'Open' : fret}
                </text>
              </g>
            );
          })}

          {[3, 5, 7, 9].filter((fret) => displayedFrets.includes(fret)).map((fret) => {
            const idx = displayedFrets.indexOf(fret);
            const x = left + idx * fretGap + fretGap * 0.5;
            return <circle key={`marker-${fret}`} cx={x} cy={(top + bottom) / 2} r={5.5} fill="rgba(255,255,255,0.22)" />;
          })}

          {displayedFrets.includes(12) ? (
            <>
              <circle cx={right - fretGap * 0.5} cy={(top + bottom) / 2 - 16} r={5.5} fill="rgba(255,255,255,0.22)" />
              <circle cx={right - fretGap * 0.5} cy={(top + bottom) / 2 + 16} r={5.5} fill="rgba(255,255,255,0.22)" />
            </>
          ) : null}

          {strings.map((stringNumber, index) => {
            const y = top + index * stringGap;
            return (
              <g key={`string-${stringNumber}`}>
                <text x={18} y={y + 4.5} textAnchor="middle" fontSize={12} fill="#f8fafc" fontWeight={700}>
                  {stringNumber}
                </text>
                <text x={36} y={y + 4.5} textAnchor="middle" fontSize={11} fill="#cbd5e1">
                  {tuningLabels[stringNumber]}
                </text>
                {mutedStrings.includes(stringNumber) ? (
                  <g>
                    <line x1={left - 18} y1={y - 8} x2={left - 4} y2={y + 8} stroke="#fda4af" strokeWidth={2.4} strokeLinecap="round" />
                    <line x1={left - 18} y1={y + 8} x2={left - 4} y2={y - 8} stroke="#fda4af" strokeWidth={2.4} strokeLinecap="round" />
                  </g>
                ) : null}
                {!mutedStrings.includes(stringNumber) && visiblePositions.some((position) => position.stringNumber === stringNumber && position.fret === 0) ? (
                  <circle cx={left - 10} cy={y} r={6} fill="#22c55e" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                ) : null}
                <line
                  x1={left}
                  y1={y}
                  x2={right}
                  y2={y}
                  stroke="#f8fafc"
                  strokeWidth={stringStrokeWidth(stringNumber)}
                  strokeLinecap="round"
                  opacity={stringOpacity(stringNumber)}
                />
              </g>
            );
          })}

          {visiblePositions.map((position) => {
            const stringIndex = strings.findIndex((value) => value === position.stringNumber);
            if (stringIndex < 0) return null;

            const y = top + stringIndex * stringGap;
            const x = isOpenWindow
              ? position.fret === 0
                ? left - 10
                : left + position.fret * fretGap - fretGap * 0.5
              : left + (position.fret - firstVisibleFret) * fretGap + fretGap * 0.5;

            return (
              <g key={`${position.stringNumber}-${position.fret}-${position.label}`}>
                <circle cx={x} cy={y} r={position.isRoot ? 14 : 12.5} fill={position.isRoot ? '#f97316' : '#38bdf8'} stroke="rgba(255,255,255,0.28)" strokeWidth={2} />
                <text x={x} y={y + 3.6} textAnchor="middle" fontSize={position.label && position.label.length > 1 ? 9.5 : 10.5} fontWeight={700} fill="#ffffff">
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
