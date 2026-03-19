'use client';

import { useMemo, useState } from 'react';

const STRINGS = [
  { name: 'e', open: 'E' },
  { name: 'B', open: 'B' },
  { name: 'G', open: 'G' },
  { name: 'D', open: 'D' },
  { name: 'A', open: 'A' },
  { name: 'E', open: 'E' },
];

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FRET_COUNT = 22;
const INLAYS = [3, 5, 7, 9, 12, 15, 17, 19, 21];

function getNote(open, fret) {
  const startIndex = NOTES.indexOf(open);
  return NOTES[(startIndex + fret) % NOTES.length];
}

function getInlay(fret) {
  if (fret === 12) return 'double';
  if (INLAYS.includes(fret)) return 'single';
  return null;
}

export default function Home() {
  const [mode, setMode] = useState('home');
  const [selected, setSelected] = useState({});

  const fretboard = useMemo(
    () =>
      STRINGS.map((string, stringIndex) => ({
        ...string,
        stringIndex,
        positions: Array.from({ length: FRET_COUNT + 1 }, (_, fret) => ({
          fret,
          note: getNote(string.open, fret),
          id: `${stringIndex}-${fret}`,
        })),
      })),
    []
  );

  const toggleNote = (id) => {
    setSelected((current) => ({
      ...current,
      [id]: !current[id],
    }));
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
          <div style={styles.fretboardScroll}>
            <div style={styles.fretboardWrap}>
              <div style={styles.fretNumbers}>
                {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => (
                  <div key={fret} style={styles.fretNumberCell}>
                    {fret}
                  </div>
                ))}
              </div>

              <div style={styles.fretboard}>
                {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => {
                  const inlay = getInlay(fret);
                  return (
                    <div
                      key={`marker-${fret}`}
                      style={{
                        ...styles.inlayColumn,
                        ...(fret === 0 ? styles.nutColumn : {}),
                      }}
                    >
                      {inlay === 'single' ? <div style={styles.singleInlay} /> : null}
                      {inlay === 'double' ? (
                        <>
                          <div style={styles.doubleInlayTop} />
                          <div style={styles.doubleInlayBottom} />
                        </>
                      ) : null}
                    </div>
                  );
                })}

                {fretboard.map((string) => (
                  <div key={string.stringIndex} style={styles.stringRow}>
                    <div style={styles.stringLabel}>{string.name}</div>
                    <div style={styles.stringLine} />

                    {string.positions.map((position) => {
                      const active = !!selected[position.id];
                      return (
                        <button
                          key={position.id}
                          type="button"
                          onClick={() => toggleNote(position.id)}
                          title={`${string.name} string, fret ${position.fret}, note ${position.note}`}
                          style={{
                            ...styles.noteCell,
                            ...(position.fret === 0 ? styles.openCell : styles.fretCell),
                            ...(active ? styles.noteCellActive : {}),
                          }}
                        >
                          <span style={styles.noteText}>{position.note}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <p style={styles.hello}>Hello my boy</p>
      )}
    </main>
  );
}

const cellWidth = '64px';

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
  title: {
    fontSize: '3rem',
    fontWeight: 700,
    margin: 0,
    textAlign: 'center',
  },
  buttonRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    minWidth: '130px',
    padding: '14px 28px',
    fontSize: '1.1rem',
    border: '2px solid #111',
    borderRadius: '14px',
    background: '#fff',
    cursor: 'pointer',
  },
  buttonActive: {
    minWidth: '130px',
    padding: '14px 28px',
    fontSize: '1.1rem',
    border: '2px solid #111',
    borderRadius: '14px',
    background: '#111',
    color: '#fff',
    cursor: 'pointer',
  },
  noteSection: {
    width: '100%',
    maxWidth: '100%',
  },
  fretboardScroll: {
    width: '100%',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  fretboardWrap: {
    minWidth: '1560px',
    padding: '8px 12px 20px',
  },
  fretNumbers: {
    display: 'grid',
    gridTemplateColumns: `60px repeat(${FRET_COUNT + 1}, ${cellWidth})`,
    alignItems: 'center',
    marginBottom: '10px',
  },
  fretNumberCell: {
    textAlign: 'center',
    fontSize: '0.95rem',
    color: '#4a4a4a',
  },
  fretboard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    background: '#d5a873',
    borderRadius: '18px',
    padding: '18px 0',
    boxShadow: 'inset 0 0 0 2px rgba(70,40,10,0.12)',
  },
  inlayColumn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: cellWidth,
    borderLeft: '2px solid rgba(110, 78, 47, 0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutColumn: {
    borderLeft: '8px solid #f2ede1',
  },
  singleInlay: {
    width: '14px',
    height: '14px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.72)',
  },
  doubleInlayTop: {
    position: 'absolute',
    top: '30%',
    width: '14px',
    height: '14px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.72)',
  },
  doubleInlayBottom: {
    position: 'absolute',
    bottom: '30%',
    width: '14px',
    height: '14px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.72)',
  },
  stringRow: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: `60px repeat(${FRET_COUNT + 1}, ${cellWidth})`,
    alignItems: 'center',
    minHeight: '56px',
    zIndex: 1,
  },
  stringLabel: {
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: 700,
  },
  stringLine: {
    position: 'absolute',
    left: '60px',
    right: 0,
    top: '50%',
    height: '2px',
    background: '#585858',
    transform: 'translateY(-50%)',
    zIndex: 0,
  },
  noteCell: {
    width: '40px',
    height: '40px',
    margin: '0 auto',
    borderRadius: '999px',
    border: '2px solid #151515',
    background: '#fbfaf7',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    zIndex: 2,
  },
  openCell: {
    background: '#efe5d5',
  },
  fretCell: {},
  noteCellActive: {
    background: '#121212',
    color: '#fff',
  },
  noteText: {
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  hello: {
    fontSize: '1.4rem',
    margin: 0,
  },
};
