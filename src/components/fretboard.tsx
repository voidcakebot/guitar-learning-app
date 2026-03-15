'use client';

import { useMemo, useState } from 'react';

import {
  filterPositionsForWindow,
  getNeckPositionWindow,
  neckPositionWindows,
  type NeckPositionWindowKey,
  type NeckViewPosition,
} from '@/lib/neck-view';

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
  const firstVisibleFret = displayedFrets[0] ?? 0;
  const isOpenWindow = firstVisibleFret === 0;

  const width = 860;
  const height = 280;
  const left = 86;
  const right = width - 26;
  const top = 70;
  const bottom = height - 56;
  const stringGap = (bottom - top) / (strings.length - 1);
  const fretGap = (right - left) / Math.max(displayedFrets.length, 1);
  const laneLeft = left + (isOpenWindow ? 0 : fretGap);
  const laneRight = right;
  const noteSize = 20;
  const rootSize = 24;

  return (
    <div className="overflow-hidden rounded-[1rem] border border-white/8 bg-[#0e1116] shadow-xl shadow-black/20">
      <div className="border-b border-white/8 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-white">Neck view</p>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm">
                Minimal reference mode focused on shape clarity.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {neckPositionWindows.map((window) => {
                const isActive = window.key === activeWindow.key;
                return (
                  <button
                    key={window.key}
                    type="button"
                    onClick={() => setActiveWindowKey(window.key)}
                    className={isActive ? 'button-primary' : 'rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-200'}
                  >
                    {window.key === 'open' ? 'Open' : `Pos ${window.label}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-3 py-3 sm:px-4">
        <div className="overflow-x-auto rounded-[1.4rem] border border-white/8 bg-[#090c10] p-2 sm:p-3">
          <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[720px] w-full sm:min-w-[860px]">
            <defs>
              <linearGradient id="neck-board" x1="0" x2="1">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="30%" stopColor="#1f2937" />
                <stop offset="75%" stopColor="#111827" />
                <stop offset="100%" stopColor="#0b0f14" />
              </linearGradient>
              <linearGradient id="fret-metal" x1="0" x2="1">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="45%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>

            <rect x={left - 10} y={top - 22} width={right - left + 20} height={bottom - top + 44} rx={12} fill="url(#neck-board)" stroke="#374151" strokeWidth="2" />
            <rect x={left - 16} y={top - 28} width={12} height={bottom - top + 56} rx={3} fill="#f8fafc" opacity={isOpenWindow ? 1 : 0.14} />

            {displayedFrets.map((fret, index) => {
              const x = left + (isOpenWindow ? index : index + 1) * fretGap;
              const labelX = left + index * fretGap + fretGap * 0.5;
              return (
                <g key={`fret-${fret}`}>
                  <line x1={x} y1={top - 14} x2={x} y2={bottom + 14} stroke="url(#fret-metal)" strokeWidth={3} />
                  <text x={labelX} y={height - 10} textAnchor="middle" fontSize={11} fill="#cbd5e1" fontWeight={600}>
                    {fret === 0 ? 'Open' : fret}
                  </text>
                </g>
              );
            })}

            {[3, 5, 7, 9].filter((fret) => displayedFrets.includes(fret)).map((fret) => {
              const idx = displayedFrets.indexOf(fret);
              const x = left + idx * fretGap + fretGap * 0.5;
              return <circle key={`marker-${fret}`} cx={x} cy={(top + bottom) / 2} r={4} fill="rgba(255,255,255,0.22)" />;
            })}

            {strings.map((stringNumber, index) => {
              const y = top + index * stringGap;
              return (
                <g key={`string-${stringNumber}`}>
                  <text x={28} y={y + 4.5} textAnchor="middle" fontSize={12} fill="#e5e7eb" fontWeight={700}>{stringNumber}</text>
                  <text x={52} y={y + 4.5} textAnchor="middle" fontSize={11} fill="#e5e7eb">{tuningLabels[stringNumber]}</text>
                  {mutedStrings.includes(stringNumber) ? (
                    <g>
                      <line x1={left - 30} y1={y - 9} x2={left - 12} y2={y + 9} stroke="#fda4af" strokeWidth={2.6} strokeLinecap="round" />
                      <line x1={left - 30} y1={y + 9} x2={left - 12} y2={y - 9} stroke="#fda4af" strokeWidth={2.6} strokeLinecap="round" />
                    </g>
                  ) : null}
                  <line x1={laneLeft} y1={y} x2={laneRight} y2={y} stroke="#e5e7eb" strokeWidth={2.8} strokeLinecap="round" opacity={0.8} />
                </g>
              );
            })}

            {visiblePositions.map((position) => {
              if (isOpenWindow && position.fret === 0) return null;
              const stringIndex = strings.findIndex((value) => value === position.stringNumber);
              if (stringIndex < 0) return null;
              const y = top + stringIndex * stringGap;
              const x = isOpenWindow ? left + position.fret * fretGap - fretGap * 0.5 : left + (position.fret - firstVisibleFret) * fretGap + fretGap * 0.5;
              const size = position.isRoot ? rootSize : noteSize;
              return (
                <g key={`${position.stringNumber}-${position.fret}-${position.label}`}>
                  <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={4} fill={position.isRoot ? '#ffffff' : '#e2e8f0'} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                  <text x={x} y={y + 4.1} textAnchor="middle" fontSize={position.label && position.label.length > 1 ? 9.6 : 10.8} fontWeight={800} fill="#0f172a">
                    {position.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
