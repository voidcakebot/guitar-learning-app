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

  const visiblePositions = useMemo(() => filterPositionsForWindow(positions, activeWindow), [activeWindow, positions]);
  const fretStart = activeWindow.start;
  const fretEnd = Math.min(activeWindow.end, frets);
  const displayedFrets = Array.from({ length: fretEnd - fretStart + 1 }, (_, index) => fretStart + index);
  const firstVisibleFret = displayedFrets[0] ?? 0;
  const isOpenWindow = firstVisibleFret === 0;

  const width = 920;
  const height = 300;
  const left = 96;
  const right = width - 28;
  const top = 76;
  const bottom = height - 58;
  const stringGap = (bottom - top) / (strings.length - 1);
  const fretGap = (right - left) / Math.max(displayedFrets.length, 1);
  const laneLeft = left + (isOpenWindow ? 0 : fretGap);
  const laneRight = right;

  return (
    <div className="card rounded-[1rem] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {neckPositionWindows.map((window) => {
          const isActive = window.key === activeWindow.key;
          return (
            <button
              key={window.key}
              type="button"
              onClick={() => setActiveWindowKey(window.key)}
              className={isActive ? 'button-primary' : 'rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06]'}
            >
              {window.key === 'open' ? 'Open' : `Window ${window.label}`}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-[1rem] border border-white/8 bg-[#080d12] p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[760px] w-full sm:min-w-[920px]">
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

          <rect x={left - 14} y={top - 24} width={right - left + 28} height={bottom - top + 48} rx={16} fill="url(#neck-board)" stroke="#334155" strokeWidth="2" />
          <rect x={left - 18} y={top - 30} width={12} height={bottom - top + 60} rx={4} fill="#f8fafc" opacity={isOpenWindow ? 1 : 0.14} />

          {displayedFrets.map((fret, index) => {
            const x = left + (isOpenWindow ? index : index + 1) * fretGap;
            const labelX = left + index * fretGap + fretGap * 0.5;
            return (
              <g key={`fret-${fret}`}>
                <line x1={x} y1={top - 14} x2={x} y2={bottom + 14} stroke="url(#fret-metal)" strokeWidth={3.2} />
                <text x={labelX} y={height - 12} textAnchor="middle" fontSize={11} fill="#cbd5e1" fontWeight={600}>
                  {fret === 0 ? 'Open' : fret}
                </text>
              </g>
            );
          })}

          {[3, 5, 7, 9].filter((fret) => displayedFrets.includes(fret)).map((fret) => {
            const idx = displayedFrets.indexOf(fret);
            const x = left + idx * fretGap + fretGap * 0.5;
            return <circle key={`marker-${fret}`} cx={x} cy={(top + bottom) / 2} r={4.5} fill="rgba(255,255,255,0.22)" />;
          })}

          {displayedFrets.includes(12) ? (
            <>
              <circle cx={right - fretGap * 0.5} cy={(top + bottom) / 2 - 18} r={4.5} fill="rgba(255,255,255,0.22)" />
              <circle cx={right - fretGap * 0.5} cy={(top + bottom) / 2 + 18} r={4.5} fill="rgba(255,255,255,0.22)" />
            </>
          ) : null}

          {strings.map((stringNumber, index) => {
            const y = top + index * stringGap;
            return (
              <g key={`string-${stringNumber}`}>
                <text x={30} y={y + 4.5} textAnchor="middle" fontSize={12} fill="#e5e7eb" fontWeight={700}>{stringNumber}</text>
                <text x={56} y={y + 4.5} textAnchor="middle" fontSize={11} fill="#e5e7eb">{tuningLabels[stringNumber]}</text>
                {mutedStrings.includes(stringNumber) ? (
                  <g>
                    <line x1={left - 34} y1={y - 9} x2={left - 14} y2={y + 9} stroke="#fda4af" strokeWidth={2.4} strokeLinecap="round" />
                    <line x1={left - 34} y1={y + 9} x2={left - 14} y2={y - 9} stroke="#fda4af" strokeWidth={2.4} strokeLinecap="round" />
                  </g>
                ) : null}
                <line x1={laneLeft} y1={y} x2={laneRight} y2={y} stroke="#e5e7eb" strokeWidth={2.6} strokeLinecap="round" opacity={0.82} />
              </g>
            );
          })}

          {visiblePositions.map((position) => {
            if (isOpenWindow && position.fret === 0) return null;
            const stringIndex = strings.findIndex((value) => value === position.stringNumber);
            if (stringIndex < 0) return null;
            const y = top + stringIndex * stringGap;
            const x = isOpenWindow
              ? left + position.fret * fretGap - fretGap * 0.5
              : left + (position.fret - firstVisibleFret) * fretGap + fretGap * 0.5;
            const size = position.isRoot ? 25 : 21;
            return (
              <g key={`${position.stringNumber}-${position.fret}-${position.label}`}>
                <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={5} fill={position.isRoot ? '#ffffff' : '#cbd5e1'} stroke="rgba(255,255,255,0.16)" strokeWidth={1.5} />
                <text x={x} y={y + 4.2} textAnchor="middle" fontSize={position.label && position.label.length > 1 ? 9.4 : 10.6} fontWeight={800} fill="#0f172a">
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
