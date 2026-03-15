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

  const totalRoots = positions.filter((position) => position.isRoot).length;
  const visibleRoots = visiblePositions.filter((position) => position.isRoot).length;
  const uniqueVisibleNotes = [...new Set(visiblePositions.map((position) => position.label).filter(Boolean))] as string[];

  const fretStart = activeWindow.start;
  const fretEnd = Math.min(activeWindow.end, frets);
  const displayedFrets = Array.from({ length: fretEnd - fretStart + 1 }, (_, index) => fretStart + index);
  const firstVisibleFret = displayedFrets[0] ?? 0;
  const isOpenWindow = firstVisibleFret === 0;

  const width = 860;
  const height = 356;
  const left = 86;
  const right = width - 26;
  const top = 82;
  const bottom = height - 74;
  const stringGap = (bottom - top) / (strings.length - 1);
  const fretGap = (right - left) / Math.max(displayedFrets.length, 1);
  const laneLeft = left + (isOpenWindow ? 0 : fretGap);
  const laneRight = right;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,20,0.96),rgba(5,9,15,0.98))] shadow-2xl shadow-slate-950/50">
      <div className="border-b border-white/8 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-white">Neck view</p>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm">
                Shift through focused position windows, spot roots instantly, and read the current note collection without losing the feel of a real fretboard.
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
                    className={isActive ? 'button-primary' : 'button-secondary'}
                  >
                    {window.key === 'open' ? 'Open' : `Pos ${window.label}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:min-w-[26rem]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
              <p className="text-[0.63rem] uppercase tracking-[0.24em] text-slate-500">Window</p>
              <p className="mt-2 text-sm font-semibold text-white">{isOpenWindow ? 'Open position' : `Frets ${activeWindow.start}–${activeWindow.end}`}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
              <p className="text-[0.63rem] uppercase tracking-[0.24em] text-slate-500">Visible notes</p>
              <p className="mt-2 text-sm font-semibold text-white">{visiblePositions.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
              <p className="text-[0.63rem] uppercase tracking-[0.24em] text-slate-500">Roots</p>
              <p className="mt-2 text-sm font-semibold text-white">{visibleRoots}/{totalRoots}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
              <p className="text-[0.63rem] uppercase tracking-[0.24em] text-slate-500">Pitch set</p>
              <p className="mt-2 truncate text-sm font-semibold text-white">{uniqueVisibleNotes.join(' · ') || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
        <div className="overflow-x-auto rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,rgba(10,16,25,0.88),rgba(6,10,18,0.96))] p-2 sm:p-3">
          <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[720px] w-full sm:min-w-[860px]">
            <defs>
              <linearGradient id="neck-wood" x1="0" x2="1">
                <stop offset="0%" stopColor="#352114" />
                <stop offset="30%" stopColor="#7b5033" />
                <stop offset="75%" stopColor="#4f3120" />
                <stop offset="100%" stopColor="#26170f" />
              </linearGradient>
              <linearGradient id="fret-metal" x1="0" x2="1">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="45%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="nut-ivory" x1="0" x2="1">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#f8fafc" />
              </linearGradient>
            </defs>

            <rect x={left - 10} y={top - 30} width={right - left + 20} height={bottom - top + 60} rx={28} fill="url(#neck-wood)" stroke="#84563b" strokeWidth="2" />
            <rect x={left - 16} y={top - 35} width={14} height={bottom - top + 70} rx={7} fill="url(#nut-ivory)" opacity={isOpenWindow ? 1 : 0.14} />

            {displayedFrets.map((fret, index) => {
              const x = left + (isOpenWindow ? index : index + 1) * fretGap;
              const labelX = left + index * fretGap + fretGap * 0.5;

              return (
                <g key={`fret-${fret}`}>
                  <rect x={labelX - fretGap * 0.5 + 2} y={top - 18} width={Math.max(fretGap - 4, 8)} height={bottom - top + 36} fill={index % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.05)'} />
                  <line
                    x1={x}
                    y1={top - 18}
                    x2={x}
                    y2={bottom + 18}
                    stroke="url(#fret-metal)"
                    strokeWidth={index === 0 && !isOpenWindow ? 6 : 4}
                  />
                  <text x={labelX} y={height - 20} textAnchor="middle" fontSize={11} fill="#cbd5e1" fontWeight={600}>
                    {fret === 0 ? 'Open' : fret}
                  </text>
                </g>
              );
            })}

            {[3, 5, 7, 9].filter((fret) => displayedFrets.includes(fret)).map((fret) => {
              const idx = displayedFrets.indexOf(fret);
              const x = left + idx * fretGap + fretGap * 0.5;
              return <circle key={`marker-${fret}`} cx={x} cy={(top + bottom) / 2} r={6} fill="rgba(255,255,255,0.22)" />;
            })}

            {displayedFrets.includes(12) ? (
              <>
                <circle cx={right - fretGap * 0.5} cy={(top + bottom) / 2 - 18} r={6} fill="rgba(255,255,255,0.22)" />
                <circle cx={right - fretGap * 0.5} cy={(top + bottom) / 2 + 18} r={6} fill="rgba(255,255,255,0.22)" />
              </>
            ) : null}

            {strings.map((stringNumber, index) => {
              const y = top + index * stringGap;
              return (
                <g key={`string-${stringNumber}`}>
                  <text x={28} y={y + 4.5} textAnchor="middle" fontSize={12} fill="#f8fafc" fontWeight={700}>
                    {stringNumber}
                  </text>
                  <text x={52} y={y + 4.5} textAnchor="middle" fontSize={11} fill="#cbd5e1">
                    {tuningLabels[stringNumber]}
                  </text>
                  {mutedStrings.includes(stringNumber) ? (
                    <g>
                      <line x1={left - 30} y1={y - 9} x2={left - 12} y2={y + 9} stroke="#fda4af" strokeWidth={2.6} strokeLinecap="round" />
                      <line x1={left - 30} y1={y + 9} x2={left - 12} y2={y - 9} stroke="#fda4af" strokeWidth={2.6} strokeLinecap="round" />
                    </g>
                  ) : null}
                  <line
                    x1={laneLeft}
                    y1={y}
                    x2={laneRight}
                    y2={y}
                    stroke="#f8fafc"
                    strokeWidth={3.2}
                    strokeLinecap="round"
                    opacity={0.95}
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
                  ? left - 16
                  : left + position.fret * fretGap - fretGap * 0.5
                : left + (position.fret - firstVisibleFret) * fretGap + fretGap * 0.5;

              return (
                <g key={`${position.stringNumber}-${position.fret}-${position.label}`}>
                  <circle cx={x} cy={y} r={position.isRoot ? 16 : 13.5} fill={position.isRoot ? '#f97316' : '#38bdf8'} stroke="rgba(255,255,255,0.36)" strokeWidth={2.2} />
                  {position.isRoot ? <circle cx={x} cy={y} r={21} fill="none" stroke="rgba(249,115,22,0.35)" strokeWidth={1.6} strokeDasharray="4 5" /> : null}
                  <text x={x} y={y + 4.1} textAnchor="middle" fontSize={position.label && position.label.length > 1 ? 9.6 : 10.8} fontWeight={800} fill="#ffffff">
                    {position.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="space-y-3">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Legend</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-4 w-4 rounded-full bg-orange-500 ring-4 ring-orange-500/20" />
                <span>Root note</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-4 w-4 rounded-full bg-sky-400 ring-4 ring-sky-400/20" />
                <span>Chord or scale tone</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none text-rose-300">✕</span>
                <span>Muted string</span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-cyan-300/15 bg-cyan-400/5 p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200/80">Practice cue</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Lock onto the orange root notes first, then trace the blue tones around them to memorize each position as a compact shape instead of a full-neck blur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
