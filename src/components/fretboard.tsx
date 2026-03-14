'use client';

import { useMemo, useState } from 'react';
import ReactFretboard from 'react-fretboard';

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

function statusFromPosition(isRoot?: boolean) {
  return isRoot ? 'root' : 'tone';
}

export function Fretboard({ positions, frets = 12 }: { positions: Position[]; frets?: number }) {
  const [activeWindowKey, setActiveWindowKey] = useState<(typeof positionWindows)[number]['key']>('open');
  const activeWindow = positionWindows.find((window) => window.key === activeWindowKey) ?? positionWindows[0];

  const selectedLocations = useMemo(() => {
    return positions
      .filter((position) => position.fret >= activeWindow.start && position.fret <= activeWindow.end)
      .map((position) => ({
        loc: {
          str: 6 - position.stringNumber,
          pos: position.fret,
        },
        label: position.label ?? '',
        status: statusFromPosition(position.isRoot),
      }));
  }, [activeWindow.end, activeWindow.start, positions]);

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
      <ReactFretboard
        tuning={tuning}
        nrOfFrets={frets + 1}
        skinType="strings"
        noteType="pc"
        showNotes={false}
        showSelectionLabels={true}
        highlightSelections={true}
        showPositionLabels={true}
        selectedLocations={selectedLocations}
        theme={{
          background: 'transparent',
          fontSize: 12,
          dimensions: {
            openWidth: 8,
            nutWidth: 0.75,
            stringHeight: 34,
          },
          skins: {
            strings: {
              highlightSize: 88,
              highlightBorder: '1px solid rgba(255,255,255,0.2)',
            },
          },
          statusMap: {
            selected: '#38bdf8',
            unselected: '#0f172a',
            root: '#f97316',
            tone: '#0ea5e9',
          },
        }}
      />
    </div>
  );
}
