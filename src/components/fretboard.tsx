'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Fretboard as FretboardRenderer } from '@moonwave99/fretboard.js';

type Position = {
  stringNumber: number;
  fret: number;
  label?: string;
  isRoot?: boolean;
};

const tuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
const positionWindows = [
  { key: 'open', label: 'Open', start: 0, end: 4 },
  { key: 'mid-low', label: '3–7', start: 3, end: 7 },
  { key: 'mid', label: '5–9', start: 5, end: 9 },
  { key: 'high', label: '7–12', start: 7, end: 12 },
] as const;

export function Fretboard({ positions, frets = 12 }: { positions: Position[]; frets?: number }) {
  const [activeWindowKey, setActiveWindowKey] = useState<(typeof positionWindows)[number]['key']>('open');
  const activeWindow = positionWindows.find((window) => window.key === activeWindowKey) ?? positionWindows[0];
  const containerRef = useRef<HTMLDivElement | null>(null);

  const visiblePositions = useMemo(() => {
    return positions.filter((position) => position.fret >= activeWindow.start && position.fret <= activeWindow.end);
  }, [activeWindow.end, activeWindow.start, positions]);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const fretboard = new FretboardRenderer({
      el: containerRef.current,
      tuning,
      fretCount: frets,
      showFretNumbers: true,
      width: 920,
      height: 240,
      stringWidth: [3, 2.6, 2.2, 1.8, 1.5, 1.3],
      fretWidth: 72,
      stringColor: '#7dd3fc',
      fretColor: '#334155',
      nutColor: '#e2e8f0',
      background: 'transparent',
      dotFill: '#0f172a',
      dotStrokeColor: 'rgba(255,255,255,0.15)',
      dotTextSize: 14,
      font: 'IBM Plex Sans, sans-serif',
      fretNumbersColor: '#94a3b8',
      leftPadding: 22,
      rightPadding: 22,
      topPadding: 28,
      bottomPadding: 28,
    });

    fretboard.render();
    fretboard.setDots(
      visiblePositions.map((position) => ({
        string: 7 - position.stringNumber,
        fret: position.fret,
        note: position.label ?? '',
        fill: position.isRoot ? '#f97316' : '#0ea5e9',
        stroke: 'rgba(255,255,255,0.2)',
      })),
    );
    fretboard.style({
      filter: (position: { note?: string }) => Boolean(position.note),
      text: (position: { note?: string }) => position.note ?? '',
      fill: (position: { fill?: string }) => position.fill ?? '#0ea5e9',
      stroke: (position: { stroke?: string }) => position.stroke ?? 'rgba(255,255,255,0.2)',
      fontFill: '#ffffff',
      fontSize: 13,
    });

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [frets, visiblePositions]);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/40">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">Neck view</p>
          <p className="text-xs text-slate-400">Choose a neck position to inspect. Nodes are labeled with note names.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {positionWindows.map((window) => {
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
      <div ref={containerRef} className="overflow-x-auto" />
    </div>
  );
}
