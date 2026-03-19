'use client';

import { useMemo, useState } from 'react';

const STRINGS = ['E', 'A', 'D', 'G', 'B', 'E'];
const OPEN_NOTES = ['E', 'A', 'D', 'G', 'B', 'E'];
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FRET_COUNT = 22;

function getNote(openNote, fret) {
  const start = NOTES.indexOf(openNote);
  return NOTES[(start + fret) % NOTES.length];
}

export default function Home() {
  const [mode, setMode] = useState('home');
  const [selected, setSelected] = useState({});

  const fretboard = useMemo(
    () =>
      STRINGS.map((label, stringIndex) => ({
        label,
        notes: Array.from({ length: FRET_COUNT }, (_, fretIndex) => {
          const fret = fretIndex + 1;
          return {
            fret,
            note: getNote(OPEN_NOTES[stringIndex], fret),
            id: `${stringIndex}-${fret}`,
          };
        }),
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
        <section style={styles.boardWrap}>
          <div style={styles.stringLabels}>
            {STRINGS.map((string) => (
              <div key={string} style={styles.stringLabel}>
                {string}
              </div>
            ))}
          </div>

          <div style={styles.fretboardScroller}>
            <div style={styles.fretboard}>
              {fretboard.map((string) => (
                <div key={string.label} style={styles.stringRow}>
                  {string.notes.map((item) => {
                    const active = !!selected[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleNote(item.id)}
                        title={`String ${string.label}, fret ${item.fret}, note ${item.note}`}
                        style={{
                          ...styles.noteButton,
                          ...(active ? styles.noteButtonActive : {}),
                        }}
                      >
                        <span style={styles.noteInner}>{item.note}</span>
                      </button>
                    );
                  })}
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
    background: '#f5f5f2',
    color: '#111',
    fontFamily: 'Arial, sans-serif',
    padding: '32px 16px 48px',
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
  boardWrap: {
    width: '100%',
    maxWidth: '1000px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
  },
  stringLabels: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(6, minmax(44px, 1fr))',
    gap: '10px',
    maxWidth: '420px',
  },
  stringLabel: {
    textAlign: 'center',
    fontSize: '1.8rem',
    letterSpacing: '0.08em',
  },
  fretboardScroller: {
    width: '100%',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  fretboard: {
    minWidth: '980px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '12px 8px 20px',
    borderTop: '6px solid #7b5a3c',
  },
  stringRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(22, 1fr)',
    gap: '10px',
    alignItems: 'center',
    position: 'relative',
  },
  noteButton: {
    aspectRatio: '1 / 1',
    width: '100%',
    minWidth: '34px',
    borderRadius: '999px',
    border: '2px solid #111',
    background: '#fff',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
  },
  noteButtonActive: {
    background: '#111',
    color: '#fff',
  },
  noteInner: {
    fontSize: '0.78rem',
    fontWeight: 700,
  },
  hello: {
    fontSize: '1.4rem',
    margin: 0,
  },
};
