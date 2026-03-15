'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { SVGuitarChord } from 'svguitar';

import type { Pattern } from '@/lib/library';
import {
  filterPositionsForWindow,
  getNeckPositionWindow,
  neckPositionWindows,
  type NeckPositionWindowKey,
  type NeckViewPosition,
} from '@/lib/neck-view';

const tuning = ['E', 'A', 'D', 'G', 'B', 'E'];

type NeckViewProps =
  | {
      mode: 'chord';
      title?: string;
      badge?: string;
      pattern: Pattern;
    }
  | {
      mode: 'scale';
      title?: string;
      badge?: string;
      positions: NeckViewPosition[];
      frets?: number;
      mutedStrings?: number[];
    };

type SvgFingerLabel = string | { text?: string; color?: string; textColor?: string; className?: string; shape?: 'circle' | 'triangle' | 'square' };
type SvgFinger = [number, number | 'x', SvgFingerLabel?];

type SvgChordData = {
  title?: string;
  position?: number;
  fingers: SvgFinger[];
  barres: Array<{ fromString: number; toString: number; fret: number; text?: string }>;
};

export function NeckView(props: NeckViewProps) {
  if (props.mode === 'chord') {
    return <ChordMode title={props.title} badge={props.badge} pattern={props.pattern} />;
  }

  return <ScaleMode title={props.title} badge={props.badge} positions={props.positions} frets={props.frets} mutedStrings={props.mutedStrings} />;
}

function Shell({ title, subtitle, badge, controls, children }: { title: string; subtitle?: string; badge: string; controls?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card rounded-[1rem] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white">{badge}</div>
      </div>
      {controls ? <div className="mb-4 flex flex-wrap gap-2">{controls}</div> : null}
      <div className="rounded-[1rem] border border-white/8 bg-[#080d12] p-3">
        {children}
      </div>
    </div>
  );
}

function SvguitarRenderer({ chord, frets = 4 }: { chord: SvgChordData; frets?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';

    new SVGuitarChord(ref.current)
      .configure({
        strings: 6,
        frets,
        tuning,
        position: chord.position ?? 1,
        title: chord.title,
        titleBottomMargin: 6,
        backgroundColor: 'none',
        color: '#e5e7eb',
        stringColor: '#e5e7eb',
        fretColor: '#cbd5e1',
        fretLabelColor: '#94a3b8',
        tuningsColor: '#e5e7eb',
        titleColor: '#f8fafc',
        fingerColor: '#e2e8f0',
        fingerTextColor: '#0f172a',
        fingerStrokeColor: '#ffffff',
        fingerStrokeWidth: 0.6,
        barreChordStrokeColor: '#ffffff',
        barreChordStrokeWidth: 0.6,
        fretMarkerColor: 'rgba(255,255,255,0.18)',
        strokeWidth: 1.8,
        fontFamily: 'IBM Plex Sans, sans-serif',
        titleFontSize: 34,
        tuningsFontSize: 22,
        fretLabelFontSize: 20,
        fingerTextSize: 18,
        noPosition: false,
      })
      .chord(chord as never)
      .draw();
  }, [chord, frets]);

  return <div ref={ref} className="svguitar-host overflow-x-auto" />;
}

function patternToSvgChord(pattern: Pattern): { chord: SvgChordData; frets: number } {
  const numericFrets = pattern.stringFrets.filter((fret): fret is number => typeof fret === 'number' && fret > 0);
  const minFret = numericFrets.length ? Math.min(...numericFrets) : 1;
  const maxFret = numericFrets.length ? Math.max(...numericFrets) : 1;
  const position = minFret > 1 ? minFret : 1;
  const frets = Math.max(4, maxFret - position + 2);

  const fingers: SvgFinger[] = pattern.stringFrets.map((fret, index) => {
    const string = index + 1;
    if (fret === 'x') return [string, 'x'];
    if (fret === 0) return [string, 0];
    const fingerText = pattern.fingers?.[index] ? String(pattern.fingers[index]) : undefined;
    return fingerText ? [string, fret, fingerText] : [string, fret];
  });

  return {
    chord: {
      title: pattern.name,
      position,
      fingers,
      barres: [],
    },
    frets,
  };
}

function positionsToSvgChord(args: { title?: string; positions: NeckViewPosition[]; windowStart: number; windowEnd: number; mutedStrings?: number[] }): { chord: SvgChordData; frets: number } {
  const { title, positions, windowStart, windowEnd, mutedStrings = [] } = args;
  const isOpen = windowStart === 0;
  const position = isOpen ? 1 : windowStart;
  const frets = Math.max(4, windowEnd - position + 1);

  const fingers: SvgFinger[] = [];
  const mutedSet = new Set(mutedStrings);

  for (const mutedString of mutedSet) {
    fingers.push([7 - mutedString, 'x']);
  }

  for (const positionItem of positions) {
    if (isOpen && positionItem.fret === 0) {
      fingers.push([7 - positionItem.stringNumber, 0]);
      continue;
    }

    const text = positionItem.label ?? '';
    fingers.push([
      7 - positionItem.stringNumber,
      positionItem.fret,
      {
        text,
        color: positionItem.isRoot ? '#ffffff' : '#cbd5e1',
        textColor: '#0f172a',
        shape: 'circle',
      },
    ]);
  }

  return {
    chord: {
      title,
      position,
      fingers,
      barres: [],
    },
    frets,
  };
}

function ChordMode({ pattern, title = 'Neck view', badge = 'Chord' }: { pattern: Pattern; title?: string; badge?: string }) {
  const { chord, frets } = useMemo(() => patternToSvgChord(pattern), [pattern]);
  return (
    <Shell title={title} subtitle={pattern.name} badge={badge}>
      <SvguitarRenderer chord={chord} frets={frets} />
    </Shell>
  );
}

function ScaleMode({ positions, frets = 12, mutedStrings = [], title = 'Neck view', badge }: { positions: NeckViewPosition[]; frets?: number; mutedStrings?: number[]; title?: string; badge?: string }) {
  const [activeWindowKey, setActiveWindowKey] = useState<NeckPositionWindowKey>('open');
  const activeWindow = getNeckPositionWindow(activeWindowKey);
  const visiblePositions = useMemo(() => filterPositionsForWindow(positions, activeWindow), [activeWindow, positions]);

  const chordData = useMemo(() => positionsToSvgChord({
    title: undefined,
    positions: visiblePositions,
    windowStart: activeWindow.start,
    windowEnd: Math.min(activeWindow.end, frets),
    mutedStrings,
  }), [visiblePositions, activeWindow.start, activeWindow.end, frets, mutedStrings]);

  return (
    <Shell
      title={title}
      subtitle="Scale window"
      badge={badge ?? (activeWindow.key === 'open' ? 'Open' : `Window ${activeWindow.label}`)}
      controls={neckPositionWindows.map((window) => {
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
    >
      <SvguitarRenderer chord={chordData.chord} frets={chordData.frets} />
    </Shell>
  );
}
