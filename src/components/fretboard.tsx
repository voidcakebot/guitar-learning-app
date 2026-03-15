'use client';

import { useMemo, useState } from 'react';

import type { FrontendVariant } from '@/components/app-shell';
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

const variantUi: Record<FrontendVariant, {
  wrap: string;
  panel: string;
  legend: boolean;
  stats: boolean;
  chipClass: string;
  noteFill: string;
  rootFill: string;
  boardBg: string;
  stringColor: string;
}> = {
  v1: {
    wrap: 'overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,20,0.96),rgba(5,9,15,0.98))] shadow-2xl shadow-slate-950/50',
    panel: 'grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start',
    legend: true,
    stats: true,
    chipClass: 'button-secondary',
    noteFill: '#38bdf8',
    rootFill: '#f97316',
    boardBg: 'bg-[linear-gradient(180deg,rgba(10,16,25,0.88),rgba(6,10,18,0.96))]',
    stringColor: '#f8fafc',
  },
  v2: {
    wrap: 'overflow-hidden rounded-[1.2rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(4,16,29,0.98),rgba(3,9,20,0.98))] shadow-xl shadow-cyan-950/30',
    panel: 'space-y-4 px-3 py-3 sm:px-4',
    legend: false,
    stats: true,
    chipClass: 'rounded-lg border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-50',
    noteFill: '#22d3ee',
    rootFill: '#f43f5e',
    boardBg: 'bg-[linear-gradient(180deg,rgba(3,17,28,0.96),rgba(4,10,20,0.96))]',
    stringColor: '#67e8f9',
  },
  v3: {
    wrap: 'overflow-hidden rounded-[1rem] border border-white/8 bg-[#0e1116] shadow-xl shadow-black/20',
    panel: 'space-y-5 px-3 py-3 sm:px-4',
    legend: false,
    stats: false,
    chipClass: 'rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-200',
    noteFill: '#e2e8f0',
    rootFill: '#ffffff',
    boardBg: 'bg-[#090c10]',
    stringColor: '#e5e7eb',
  },
  v4: {
    wrap: 'overflow-hidden rounded-[2rem] border border-fuchsia-400/20 bg-[linear-gradient(180deg,rgba(30,9,32,0.98),rgba(12,7,20,0.98))] shadow-2xl shadow-fuchsia-950/30',
    panel: 'grid gap-5 px-4 py-4 sm:px-5 xl:grid-cols-[14rem_minmax(0,1fr)] xl:items-start',
    legend: true,
    stats: false,
    chipClass: 'rounded-full border border-fuchsia-300/20 bg-fuchsia-300/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-50',
    noteFill: '#c084fc',
    rootFill: '#fb7185',
    boardBg: 'bg-[linear-gradient(180deg,rgba(24,9,34,0.94),rgba(13,7,24,0.98))]',
    stringColor: '#f5d0fe',
  },
  v5: {
    wrap: 'overflow-hidden rounded-[1.5rem] border border-emerald-300/20 bg-[linear-gradient(180deg,rgba(7,23,20,0.98),rgba(5,14,13,0.98))] shadow-2xl shadow-emerald-950/25',
    panel: 'grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start',
    legend: true,
    stats: true,
    chipClass: 'rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-medium text-emerald-50',
    noteFill: '#34d399',
    rootFill: '#fbbf24',
    boardBg: 'bg-[linear-gradient(180deg,rgba(8,22,19,0.94),rgba(6,12,12,0.98))]',
    stringColor: '#d1fae5',
  },
};

export function Fretboard({ positions, frets = 12, mutedStrings = [], variant = 'v1' }: { positions: NeckViewPosition[]; frets?: number; mutedStrings?: number[]; variant?: FrontendVariant }) {
  const [activeWindowKey, setActiveWindowKey] = useState<NeckPositionWindowKey>('open');
  const activeWindow = getNeckPositionWindow(activeWindowKey);
  const ui = variantUi[variant];

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
  const height = variant === 'v2' ? 300 : variant === 'v3' ? 280 : 356;
  const left = 86;
  const right = width - 26;
  const top = variant === 'v3' ? 70 : 82;
  const bottom = height - (variant === 'v3' ? 56 : 74);
  const stringGap = (bottom - top) / (strings.length - 1);
  const fretGap = (right - left) / Math.max(displayedFrets.length, 1);
  const laneLeft = left + (isOpenWindow ? 0 : fretGap);
  const laneRight = right;
  const noteRadius = variant === 'v2' ? 11 : variant === 'v3' ? 10 : variant === 'v4' ? 15 : 13.5;
  const rootRadius = noteRadius + 2.5;

  return (
    <div className={ui.wrap}>
      <div className="border-b border-white/8 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-white">Neck view</p>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm">
                {variant === 'v2'
                  ? 'Compact tool mode with quick scanning and tighter controls.'
                  : variant === 'v3'
                    ? 'Minimal reference mode focused on shape clarity.'
                    : variant === 'v4'
                      ? 'Expressive stage-style layout with louder visual emphasis.'
                      : variant === 'v5'
                        ? 'Practice-first mode with readable note grouping and calmer contrast.'
                        : 'Shift through focused position windows and read the note collection clearly.'}
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
                    className={isActive ? 'button-primary' : ui.chipClass}
                  >
                    {window.key === 'open' ? 'Open' : `Pos ${window.label}`}
                  </button>
                );
              })}
            </div>
          </div>

          {ui.stats ? (
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
          ) : null}
        </div>
      </div>

      <div className={ui.panel}>
        {variant === 'v4' && ui.legend ? (
          <div className="space-y-3 xl:order-1">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Legend</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3"><span className="inline-flex h-4 w-4 rounded-full" style={{ backgroundColor: ui.rootFill }} /><span>Root note</span></div>
                <div className="flex items-center gap-3"><span className="inline-flex h-4 w-4 rounded-full" style={{ backgroundColor: ui.noteFill }} /><span>Tone</span></div>
                <div className="flex items-center gap-3"><span className="text-lg leading-none text-rose-300">✕</span><span>Muted string</span></div>
              </div>
            </div>
          </div>
        ) : null}

        <div className={`overflow-x-auto rounded-[1.4rem] border border-white/8 p-2 sm:p-3 ${ui.boardBg} ${variant === 'v4' ? 'xl:order-2' : ''}`}>
          <svg viewBox={`0 0 ${width} ${height}`} className={`w-full ${variant === 'v2' ? 'min-w-[680px]' : 'min-w-[720px] sm:min-w-[860px]'}`}>
            <defs>
              <linearGradient id="neck-wood" x1="0" x2="1">
                <stop offset="0%" stopColor={variant === 'v3' ? '#111827' : '#352114'} />
                <stop offset="30%" stopColor={variant === 'v3' ? '#1f2937' : '#7b5033'} />
                <stop offset="75%" stopColor={variant === 'v3' ? '#111827' : '#4f3120'} />
                <stop offset="100%" stopColor={variant === 'v3' ? '#0b0f14' : '#26170f'} />
              </linearGradient>
              <linearGradient id="fret-metal" x1="0" x2="1">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="45%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>

            <rect x={left - 10} y={top - 30} width={right - left + 20} height={bottom - top + 60} rx={variant === 'v3' ? 12 : 28} fill="url(#neck-wood)" stroke={variant === 'v3' ? '#374151' : '#84563b'} strokeWidth="2" />
            <rect x={left - 16} y={top - 35} width={variant === 'v2' ? 8 : 14} height={bottom - top + 70} rx={variant === 'v3' ? 3 : 7} fill="#f8fafc" opacity={isOpenWindow ? 1 : 0.14} />

            {displayedFrets.map((fret, index) => {
              const x = left + (isOpenWindow ? index : index + 1) * fretGap;
              const labelX = left + index * fretGap + fretGap * 0.5;
              return (
                <g key={`fret-${fret}`}>
                  {variant !== 'v3' ? <rect x={labelX - fretGap * 0.5 + 2} y={top - 18} width={Math.max(fretGap - 4, 8)} height={bottom - top + 36} fill={index % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.05)'} /> : null}
                  <line x1={x} y1={top - 18} x2={x} y2={bottom + 18} stroke="url(#fret-metal)" strokeWidth={variant === 'v2' ? 2.5 : index === 0 && !isOpenWindow ? 6 : 4} />
                  <text x={labelX} y={height - (variant === 'v3' ? 10 : 20)} textAnchor="middle" fontSize={variant === 'v2' ? 10 : 11} fill="#cbd5e1" fontWeight={600}>
                    {fret === 0 ? 'Open' : fret}
                  </text>
                </g>
              );
            })}

            {[3, 5, 7, 9].filter((fret) => displayedFrets.includes(fret)).map((fret) => {
              const idx = displayedFrets.indexOf(fret);
              const x = left + idx * fretGap + fretGap * 0.5;
              return <circle key={`marker-${fret}`} cx={x} cy={(top + bottom) / 2} r={variant === 'v2' ? 4 : 6} fill="rgba(255,255,255,0.22)" />;
            })}

            {strings.map((stringNumber, index) => {
              const y = top + index * stringGap;
              return (
                <g key={`string-${stringNumber}`}>
                  <text x={28} y={y + 4.5} textAnchor="middle" fontSize={variant === 'v2' ? 11 : 12} fill={ui.stringColor} fontWeight={700}>{stringNumber}</text>
                  <text x={52} y={y + 4.5} textAnchor="middle" fontSize={11} fill={ui.stringColor}>{tuningLabels[stringNumber]}</text>
                  {mutedStrings.includes(stringNumber) ? (
                    <g>
                      <line x1={left - 30} y1={y - 9} x2={left - 12} y2={y + 9} stroke="#fda4af" strokeWidth={2.6} strokeLinecap="round" />
                      <line x1={left - 30} y1={y + 9} x2={left - 12} y2={y - 9} stroke="#fda4af" strokeWidth={2.6} strokeLinecap="round" />
                    </g>
                  ) : null}
                  <line x1={laneLeft} y1={y} x2={laneRight} y2={y} stroke={ui.stringColor} strokeWidth={variant === 'v2' ? 2.2 : variant === 'v3' ? 2.8 : 3.2} strokeLinecap="round" opacity={variant === 'v3' ? 0.8 : 0.95} />
                </g>
              );
            })}

            {visiblePositions.map((position) => {
              if (isOpenWindow && position.fret === 0) return null;
              const stringIndex = strings.findIndex((value) => value === position.stringNumber);
              if (stringIndex < 0) return null;
              const y = top + stringIndex * stringGap;
              const x = isOpenWindow ? left + position.fret * fretGap - fretGap * 0.5 : left + (position.fret - firstVisibleFret) * fretGap + fretGap * 0.5;
              return (
                <g key={`${position.stringNumber}-${position.fret}-${position.label}`}>
                  {variant === 'v3' ? <rect x={x - noteRadius} y={y - noteRadius} width={noteRadius * 2} height={noteRadius * 2} rx={4} fill={position.isRoot ? ui.rootFill : ui.noteFill} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} /> : <circle cx={x} cy={y} r={position.isRoot ? rootRadius : noteRadius} fill={position.isRoot ? ui.rootFill : ui.noteFill} stroke="rgba(255,255,255,0.36)" strokeWidth={variant === 'v2' ? 1.5 : 2.2} />}
                  {position.isRoot && variant !== 'v3' ? <circle cx={x} cy={y} r={rootRadius + 5} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.3} strokeDasharray={variant === 'v5' ? '2 4' : '4 5'} /> : null}
                  <text x={x} y={y + 4.1} textAnchor="middle" fontSize={variant === 'v2' ? 9 : position.label && position.label.length > 1 ? 9.6 : 10.8} fontWeight={800} fill={variant === 'v3' ? '#0f172a' : '#ffffff'}>{position.label}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {variant !== 'v4' && ui.legend ? (
          <div className="space-y-3">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">Legend</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3"><span className="inline-flex h-4 w-4 rounded-full" style={{ backgroundColor: ui.rootFill }} /><span>Root note</span></div>
                <div className="flex items-center gap-3"><span className="inline-flex h-4 w-4 rounded-full" style={{ backgroundColor: ui.noteFill }} /><span>Chord or scale tone</span></div>
                <div className="flex items-center gap-3"><span className="text-lg leading-none text-rose-300">✕</span><span>Muted string</span></div>
              </div>
            </div>
            {variant !== 'v2' ? (
              <div className="rounded-[1.4rem] border border-cyan-300/15 bg-cyan-400/5 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200/80">Practice cue</p>
                <p className="mt-3 text-sm leading-6 text-slate-200">Lock onto the root notes first, then trace the surrounding tones to memorize each position as a compact shape.</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
