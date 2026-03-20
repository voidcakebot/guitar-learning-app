'use client';

import { useState } from 'react';

const STRINGS = [
  { name: 'E', open: 'E', gauge: 3.6 },
  { name: 'A', open: 'A', gauge: 3.1 },
  { name: 'D', open: 'D', gauge: 2.6 },
  { name: 'G', open: 'G', gauge: 2.1 },
  { name: 'B', open: 'B', gauge: 1.6 },
  { name: 'e', open: 'E', gauge: 1.2 },
];

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FRET_COUNT = 22;
const INLAYS = [3, 5, 7, 9, 12, 15, 17, 19, 21];

function getNote(open, fret) {
  const startIndex = NOTES.indexOf(open);
  return NOTES[(startIndex + fret) % NOTES.length];
}

function SvgFretboard({ selected, onToggle }) {
  const width = 420;
  const rowHeight = 64;
  const headerHeight = 30;
  const boardX = 42;
  const boardY = headerHeight;
  const boardWidth = width - boardX - 8;
  const boardHeight = rowHeight * (FRET_COUNT + 1);
  const stringXs = STRINGS.map((_, index) => boardX + (boardWidth / 12) + index * (boardWidth / 6));
  const rowCenterY = (fret) => boardY + fret * rowHeight + rowHeight / 2;

  return (
    <div style={styles.svgWrap}>
      <svg viewBox={`0 0 ${width} ${boardHeight + headerHeight + 8}`} style={styles.svgBoard}>
        <rect x={boardX} y={boardY} width={boardWidth} height={boardHeight} rx="16" fill="#cf9a61" />

        {STRINGS.map((string, index) => (
          <text key={string.name + index} x={stringXs[index]} y={20} textAnchor="middle" fontSize="14" fontWeight="700" fill="#161616">
            {string.name}
          </text>
        ))}

        {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => (
          <text key={`fret-label-${fret}`} x={18} y={rowCenterY(fret) + 4} textAnchor="middle" fontSize="12" fill="#51402c">
            {fret}
          </text>
        ))}

        {INLAYS.filter((fret) => fret !== 12).map((fret) => (
          <circle
            key={`inlay-${fret}`}
            cx={boardX + boardWidth / 2}
            cy={rowCenterY(fret)}
            r="9"
            fill="#fff7cf"
            stroke="rgba(60,45,20,0.22)"
            strokeWidth="2"
          />
        ))}
        <circle cx={boardX + boardWidth * 0.35} cy={rowCenterY(12)} r="9" fill="#fff7cf" stroke="rgba(60,45,20,0.22)" strokeWidth="2" />
        <circle cx={boardX + boardWidth * 0.65} cy={rowCenterY(12)} r="9" fill="#fff7cf" stroke="rgba(60,45,20,0.22)" strokeWidth="2" />

        {Array.from({ length: FRET_COUNT }, (_, index) => {
          const fret = index + 1;
          const y = boardY + fret * rowHeight;
          return <line key={`wire-${fret}`} x1={boardX} y1={y} x2={boardX + boardWidth} y2={y} stroke="#b89467" strokeOpacity="0.55" strokeWidth="1" />;
        })}

        {STRINGS.map((string, index) => {
          const x = stringXs[index];
          return (
            <line
              key={`string-${string.name}-${index}`}
              x1={x}
              y1={boardY + rowHeight}
              x2={x}
              y2={boardY + boardHeight}
              stroke="#bfc3c9"
              strokeWidth={string.gauge}
              strokeLinecap="round"
            />
          );
        })}

        <line x1={boardX} y1={boardY + rowHeight} x2={boardX + boardWidth} y2={boardY + rowHeight} stroke="#f4eee1" strokeWidth="8" />

        {Array.from({ length: FRET_COUNT + 1 }, (_, fret) =>
          STRINGS.map((string, stringIndex) => {
            const id = `svg-${fret}-${stringIndex}`;
            const active = !!selected[id];
            return (
              <g key={id}>
                <circle
                  cx={stringXs[stringIndex]}
                  cy={rowCenterY(fret)}
                  r="21"
                  fill={active ? '#121212' : fret === 0 ? '#efe5d5' : '#fbfaf7'}
                  stroke="#151515"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    onToggle(id);
                  }}
                />
                <text
                  x={stringXs[stringIndex]}
                  y={rowCenterY(fret) + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill={active ? '#fff' : '#161616'}
                  pointerEvents="none"
                  style={{ userSelect: 'none' }}
                >
                  {getNote(string.open, fret)}
                </text>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState('home');
  const [svgSelected, setSvgSelected] = useState({});

  const toggleSvgNote = (id) => {
    setSvgSelected((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>guitar Note</h1>

      <div style={styles.buttonRow}>
        <button type="button" style={mode === 'note' ? styles.buttonActive : styles.button} onClick={() => setMode('note')}>
          Note
        </button>
        <button type="button" style={mode === 'learn' ? styles.buttonActive : styles.button} onClick={() => setMode('learn')}>
          Learn
        </button>
      </div>

      {mode === 'note' ? <SvgFretboard selected={svgSelected} onToggle={toggleSvgNote} /> : <p style={styles.hello}>Hello my boy</p>}
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    background: '#f5f3ed',
    color: '#161616',
    fontFamily: 'Arial, sans-serif',
    padding: '32px 12px 48px',
  },
  title: { fontSize: '3rem', fontWeight: 700, margin: 0, textAlign: 'center' },
  buttonRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' },
  button: {
    minWidth: '130px', padding: '14px 28px', fontSize: '1.1rem', border: '2px solid #111', borderRadius: '14px', background: '#fff', cursor: 'pointer',
  },
  buttonActive: {
    minWidth: '130px', padding: '14px 28px', fontSize: '1.1rem', border: '2px solid #111', borderRadius: '14px', background: '#111', color: '#fff', cursor: 'pointer',
  },
  svgWrap: { width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '8px' },
  svgBoard: { width: '100%', height: 'auto', display: 'block' },
  hello: { fontSize: '1.4rem', margin: 0 },
};
