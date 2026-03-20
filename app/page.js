'use client';

import { useMemo, useState } from 'react';

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
  const rowHeight = 42;
  const headerHeight = 30;
  const fretNumberWidth = 28;
  const boardX = 42;
  const boardY = headerHeight;
  const boardWidth = width - boardX - 8;
  const boardHeight = rowHeight * (FRET_COUNT + 1);
  const stringXs = STRINGS.map((_, index) => boardX + (boardWidth / 12) + index * (boardWidth / 6));
  const rowCenterY = (fret) => boardY + fret * rowHeight + rowHeight / 2;

  return (
    <div style={styles.svgWrap}>
      <div style={styles.svgTitle}>SVG version</div>
      <svg viewBox={`0 0 ${width} ${boardHeight + headerHeight + 8}`} style={styles.svgBoard}>
        <rect x={boardX} y={boardY} width={boardWidth} height={boardHeight} rx="16" fill="#cf9a61" />

        {STRINGS.map((string, index) => (
          <text key={string.name + index} x={stringXs[index]} y={20} textAnchor="middle" fontSize="14" fontWeight="700" fill="#161616">
            {string.name}
          </text>
        ))}

        {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => (
          <text
            key={`fret-label-${fret}`}
            x={18}
            y={rowCenterY(fret) + 4}
            textAnchor="middle"
            fontSize="12"
            fill="#51402c"
          >
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
        <circle
          cx={boardX + boardWidth * 0.35}
          cy={rowCenterY(12)}
          r="9"
          fill="#fff7cf"
          stroke="rgba(60,45,20,0.22)"
          strokeWidth="2"
        />
        <circle
          cx={boardX + boardWidth * 0.65}
          cy={rowCenterY(12)}
          r="9"
          fill="#fff7cf"
          stroke="rgba(60,45,20,0.22)"
          strokeWidth="2"
        />

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

        <line
          x1={boardX}
          y1={boardY + rowHeight}
          x2={boardX + boardWidth}
          y2={boardY + rowHeight}
          stroke="#f4eee1"
          strokeWidth="8"
        />

        {Array.from({ length: FRET_COUNT + 1 }, (_, fret) =>
          STRINGS.map((string, stringIndex) => {
            const id = `svg-${fret}-${stringIndex}`;
            const active = !!selected[id];
            return (
              <g key={id} onClick={() => onToggle(id)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={stringXs[stringIndex]}
                  cy={rowCenterY(fret)}
                  r="16"
                  fill={active ? '#121212' : fret === 0 ? '#efe5d5' : '#fbfaf7'}
                  stroke="#151515"
                  strokeWidth="2"
                />
                <text
                  x={stringXs[stringIndex]}
                  y={rowCenterY(fret) + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={active ? '#fff' : '#161616'}
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
  const [selected, setSelected] = useState({});
  const [svgSelected, setSvgSelected] = useState({});

  const fretboard = useMemo(
    () =>
      Array.from({ length: FRET_COUNT + 1 }, (_, fret) => ({
        fret,
        inlay: INLAYS.includes(fret),
        doubleInlay: fret === 12,
        positions: STRINGS.map((string, stringIndex) => ({
          id: `${fret}-${stringIndex}`,
          string: string.name,
          note: getNote(string.open, fret),
          fret,
          gauge: string.gauge,
        })),
      })),
    []
  );

  const toggleNote = (id) => {
    setSelected((current) => ({ ...current, [id]: !current[id] }));
  };

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

      {mode === 'note' ? (
        <section style={styles.noteSection}>
          <div style={styles.boardShell}>
            <div style={styles.stringHeaderRow}>
              <div style={styles.cornerCell} />
              {STRINGS.map((string) => (
                <div key={string.name} style={styles.stringHeader}>
                  {string.name}
                </div>
              ))}
            </div>

            <div style={styles.fretboard}>
              {fretboard.map((row) => (
                <div key={row.fret} style={styles.fretRowWrap}>
                  <div style={styles.fretNumber}>{row.fret}</div>

                  <div style={row.fret === 0 ? styles.nutRow : styles.fretRow}>
                    {row.inlay && row.fret !== 0 && row.fret !== 12 ? <div style={styles.singleInlay} /> : null}
                    {row.doubleInlay ? (
                      <>
                        <div style={styles.doubleInlayTop} />
                        <div style={styles.doubleInlayBottom} />
                      </>
                    ) : null}

                    {row.fret !== 0 ? <div style={styles.fretWire} /> : null}

                    {row.positions.map((position) => {
                      const active = !!selected[position.id];
                      return (
                        <div key={position.id} style={styles.cellWrap}>
                          {row.fret !== 0 ? <div style={{ ...styles.stringLine, width: `${position.gauge}px` }} /> : null}
                          <button
                            type="button"
                            onClick={() => toggleNote(position.id)}
                            title={`${position.string} string, fret ${position.fret}, note ${position.note}`}
                            style={{
                              ...styles.noteCell,
                              ...(row.fret === 0 ? styles.openNoteCell : {}),
                              ...(active ? styles.noteCellActive : {}),
                            }}
                          >
                            <span style={styles.noteText}>{position.note}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SvgFretboard selected={svgSelected} onToggle={toggleSvgNote} />
        </section>
      ) : (
        <p style={styles.hello}>Hello my boy</p>
      )}
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
  noteSection: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' },
  boardShell: { width: '100%', maxWidth: '560px' },
  stringHeaderRow: { display: 'grid', gridTemplateColumns: '44px repeat(6, 1fr)', alignItems: 'center', marginBottom: '8px' },
  cornerCell: { height: '20px' },
  stringHeader: { textAlign: 'center', fontSize: '1rem', fontWeight: 700 },
  fretboard: {
    display: 'flex', flexDirection: 'column', gap: '0', background: '#cf9a61', borderRadius: '18px', overflow: 'hidden', boxShadow: 'inset 0 0 0 2px rgba(70,40,10,0.08)',
  },
  fretRowWrap: { display: 'grid', gridTemplateColumns: '44px 1fr', alignItems: 'stretch' },
  fretNumber: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.92rem', color: '#51402c', background: '#ead4b7', borderBottom: '1px solid rgba(90, 60, 30, 0.1)',
  },
  nutRow: {
    position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', minHeight: '56px', alignItems: 'center', background: '#d7b083', borderBottom: '8px solid #f4eee1',
  },
  fretRow: { position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', minHeight: '56px', alignItems: 'center' },
  fretWire: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: '1px', background: '#b89467', opacity: 0.55, zIndex: 1, pointerEvents: 'none',
  },
  cellWrap: { position: 'relative', display: 'grid', placeItems: 'center', height: '100%' },
  stringLine: {
    position: 'absolute', top: 0, bottom: 0, left: '50%', background: '#bfc3c9', boxShadow: '0 0 1px rgba(0,0,0,0.18)', transform: 'translateX(-50%)', zIndex: 3, pointerEvents: 'none',
  },
  noteCell: {
    position: 'relative', zIndex: 4, width: '38px', height: '38px', margin: '0 auto', borderRadius: '999px', border: '2px solid #151515', background: '#fbfaf7', display: 'grid', placeItems: 'center', cursor: 'pointer',
  },
  openNoteCell: { background: '#efe5d5' },
  noteCellActive: { background: '#121212', color: '#fff' },
  noteText: { fontSize: '0.78rem', fontWeight: 700 },
  singleInlay: {
    position: 'absolute', left: '50%', top: '50%', width: '18px', height: '18px', borderRadius: '999px', background: '#fff7cf', border: '2px solid rgba(60, 45, 20, 0.22)', boxShadow: '0 0 0 2px rgba(255,255,255,0.18)', transform: 'translate(-50%, -50%)', zIndex: 0,
  },
  doubleInlayTop: {
    position: 'absolute', left: '34%', top: '50%', width: '18px', height: '18px', borderRadius: '999px', background: '#fff7cf', border: '2px solid rgba(60, 45, 20, 0.22)', boxShadow: '0 0 0 2px rgba(255,255,255,0.18)', transform: 'translate(-50%, -50%)', zIndex: 0,
  },
  doubleInlayBottom: {
    position: 'absolute', left: '66%', top: '50%', width: '18px', height: '18px', borderRadius: '999px', background: '#fff7cf', border: '2px solid rgba(60, 45, 20, 0.22)', boxShadow: '0 0 0 2px rgba(255,255,255,0.18)', transform: 'translate(-50%, -50%)', zIndex: 0,
  },
  svgWrap: { width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '8px' },
  svgTitle: { fontSize: '1rem', fontWeight: 700, textAlign: 'center' },
  svgBoard: { width: '100%', height: 'auto', display: 'block' },
  hello: { fontSize: '1.4rem', margin: 0 },
};
