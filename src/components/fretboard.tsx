'use client';

import ReactFretboard from 'react-fretboard';

type Position = {
  stringNumber: number;
  fret: number;
  label?: string;
  isRoot?: boolean;
};

const tuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

function statusFromLabel(label?: string, isRoot?: boolean) {
  if (isRoot) return 'root';

  switch (label) {
    case 'b2': return 'flat2';
    case '2nd': return 'second';
    case 'b3': return 'flat3';
    case '3rd': return 'third';
    case '4th': return 'fourth';
    case 'b5': return 'flat5';
    case '5th': return 'fifth';
    case '#5': return 'sharp5';
    case '6th': return 'sixth';
    case 'b7': return 'flat7';
    case '7th': return 'seventh';
    default: return 'tone';
  }
}

export function Fretboard({ positions, frets = 12 }: { positions: Position[]; frets?: number }) {
  const selectedLocations = positions.map((position) => ({
    loc: {
      str: 6 - position.stringNumber,
      pos: position.fret,
    },
    label: position.label ?? '',
    status: statusFromLabel(position.label, position.isRoot),
  }));

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/40">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">Fretboard view</p>
          <p className="text-xs text-slate-400">Rendered with react-fretboard. Root and interval roles are highlighted across the neck.</p>
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
            flat2: '#7dd3fc',
            second: '#7dd3fc',
            flat3: '#38bdf8',
            third: '#22d3ee',
            fourth: '#67e8f9',
            flat5: '#60a5fa',
            fifth: '#34d399',
            sharp5: '#a78bfa',
            sixth: '#facc15',
            flat7: '#fda4af',
            seventh: '#f9a8d4',
          },
        }}
      />
    </div>
  );
}
