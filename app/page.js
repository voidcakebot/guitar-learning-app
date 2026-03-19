'use client';

import { useMemo, useState } from 'react';

const STRINGS = [
  { name: 'E', open: 'E' },
  { name: 'A', open: 'A' },
  { name: 'D', open: 'D' },
  { name: 'G', open: 'G' },
  { name: 'B', open: 'B' },
  { name: 'e', open: 'E' },
];

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FRET_COUNT = 22;
const INLAYS = [3, 5, 7, 9, 12, 15, 17, 19, 21];

function getNote(open, fret) {
  const startIndex = NOTES.indexOf(open);
  return NOTES[(startIndex + fret) % NOTES.length];
}

export default function Home() {
  const [mode, setMode] = useState('home');
  const [selected, setSelected] = useState({});

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
                    <div style={styles.stringLinesOverlay}>
                      {STRINGS.map((string, index) => (
                        <div
                          key={`${string.name}-${index}`}
                          style={{
                            ...styles.stringLine,
                            left: `calc(${index} * (100% / 6) + (100% / 12))`,
                          }}
                        />
                      ))}
                    </div>

                    {row.positions.map((position) => {
                      const active = !!selected[position.id];
                      return (
                        <button
                          key={position.id}
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
                      );
                    })}

                    {row.inlay && row.fret !== 0 && row.fret !== 12 ? <div style={styles.singleInlay} /> : null}
                    {row.doubleInlay ? (
                      <>
                        <div style={styles.doubleInlayTop} />
                        <div style={styles.doubleInlayBottom} />
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
    display: 'flex',
    justifyContent: 'center',
  },
  boardShell: {
    width: '100%',
    maxWidth: '560px',
  },
  stringHeaderRow: {
    display: 'grid',
    gridTemplateColumns: '44px repeat(6, 1fr)',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cornerCell: {
    height: '20px',
  },
  stringHeader: {
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: 700,
  },
  fretboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    background: '#cf9a61',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 0 2px rgba(70,40,10,0.12)',
  },
  fretRowWrap: {
    display: 'grid',
    gridTemplateColumns: '44px 1fr',
    alignItems: 'stretch',
  },
  fretNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.92rem',
    color: '#51402c',
    background: '#ead4b7',
    borderBottom: '2px solid rgba(90, 60, 30, 0.14)',
  },
  nutRow: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    minHeight: '56px',
    alignItems: 'center',
    background: '#d7b083',
    borderBottom: '8px solid #f4eee1',
  },
  fretRow: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    minHeight: '56px',
    alignItems: 'center',
    borderBottom: '2px solid rgba(101, 69, 39, 0.5)',
  },
  stringLinesOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  stringLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '2px',
    background: '#555',
    transform: 'translateX(-50%)',
  },
  noteCell: {
    position: 'relative',
    zIndex: 1,
    width: '38px',
    height: '38px',
    margin: '0 auto',
    borderRadius: '999px',
    border: '2px solid #151515',
    background: '#fbfaf7',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
  },
  openNoteCell: {
    background: '#efe5d5',
  },
  noteCellActive: {
    background: '#121212',
    color: '#fff',
  },
  noteText: {
    fontSize: '0.78rem',
    fontWeight: 700,
  },
  singleInlay: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '18px',
    height: '18px',
    borderRadius: '999px',
    background: '#fff7cf',
    border: '2px solid rgba(60, 45, 20, 0.35)',
    boxShadow: '0 0 0 2px rgba(255,255,255,0.25)',
    transform: 'translate(-50%, -50%)',
    zIndex: 0,
  },
  doubleInlayTop: {
    position: 'absolute',
    left: '34%',
    top: '50%',
    width: '18px',
    height: '18px',
    borderRadius: '999px',
    background: '#fff7cf',
    border: '2px solid rgba(60, 45, 20, 0.35)',
    boxShadow: '0 0 0 2px rgba(255,255,255,0.25)',
    transform: 'translate(-50%, -50%)',
    zIndex: 0,
  },
  doubleInlayBottom: {
    position: 'absolute',
    left: '66%',
    top: '50%',
    width: '18px',
    height: '18px',
    borderRadius: '999px',
    background: '#fff7cf',
    border: '2px solid rgba(60, 45, 20, 0.35)',
    boxShadow: '0 0 0 2px rgba(255,255,255,0.25)',
    transform: 'translate(-50%, -50%)',
    zIndex: 0,
  },
  hello: {
    fontSize: '1.4rem',
    margin: 0,
  },
};
