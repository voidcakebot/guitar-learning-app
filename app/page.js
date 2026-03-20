'use client';

import { useMemo, useState } from 'react';

const TUNINGS = {
  standard: {
    label: 'Standard',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'],
  },
  dadgad: {
    label: 'DADGAD',
    notes: ['D', 'A', 'D', 'G', 'A', 'D'],
  },
};

const STRING_GAUGES = [3.6, 3.1, 2.6, 2.1, 1.6, 1.2];
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FRET_COUNT = 22;
const INLAYS = [3, 5, 7, 9, 12, 15, 17, 19, 21];

function getNote(open, fret) {
  const startIndex = NOTES.indexOf(open);
  return NOTES[(startIndex + fret) % NOTES.length];
}

function makeUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function SvgFretboard({ tuningNotes, selected, onToggle }) {
  const width = 420;
  const rowHeight = 64;
  const headerHeight = 30;
  const boardX = 42;
  const boardY = headerHeight;
  const boardWidth = width - boardX - 8;
  const boardHeight = rowHeight * (FRET_COUNT + 1);
  const stringXs = tuningNotes.map((_, index) => boardX + boardWidth / 12 + index * (boardWidth / 6));
  const rowCenterY = (fret) => boardY + fret * rowHeight + rowHeight / 2;

  return (
    <div style={styles.svgWrap}>
      <svg viewBox={`0 0 ${width} ${boardHeight + headerHeight + 8}`} style={styles.svgBoard}>
        <rect x={boardX} y={boardY} width={boardWidth} height={boardHeight} rx="16" fill="#cf9a61" />

        {tuningNotes.map((note, index) => (
          <text key={note + index} x={stringXs[index]} y={20} textAnchor="middle" fontSize="14" fontWeight="700" fill="#161616">
            {note}
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
          return <line key={`wire-${fret}`} x1={boardX} y1={y} x2={boardX + boardWidth} y2={y} stroke="#aa8358" strokeOpacity="0.72" strokeWidth="1.2" />;
        })}

        {tuningNotes.map((_, index) => {
          const x = stringXs[index];
          return (
            <line
              key={`string-${index}`}
              x1={x}
              y1={boardY + rowHeight}
              x2={x}
              y2={boardY + boardHeight}
              stroke="#bfc3c9"
              strokeWidth={STRING_GAUGES[index]}
              strokeLinecap="round"
            />
          );
        })}

        <line x1={boardX} y1={boardY + rowHeight} x2={boardX + boardWidth} y2={boardY + rowHeight} stroke="#f4eee1" strokeWidth="8" />

        {Array.from({ length: FRET_COUNT + 1 }, (_, fret) =>
          tuningNotes.map((openNote, stringIndex) => {
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
                    onToggle(id, fret, stringIndex);
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
                  {getNote(openNote, fret)}
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
  const [selectedTuning, setSelectedTuning] = useState('standard');
  const [svgSelected, setSvgSelected] = useState({});
  const [name, setName] = useState('');
  const [category, setCategory] = useState('chord');
  const [tags, setTags] = useState('');
  const [savedItems, setSavedItems] = useState([]);

  const tuningNotes = useMemo(() => TUNINGS[selectedTuning].notes, [selectedTuning]);

  const toggleSvgNote = (id, fretIndex, stringIndex) => {
    setSvgSelected((current) => {
      const next = { ...current };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = { id, fretIndex, stringIndex };
      }
      return next;
    });
  };

  const handleSave = () => {
    const markers = Object.values(svgSelected);
    if (!name.trim() || markers.length === 0) return;

    const item = {
      id: makeUuid(),
      name: name.trim(),
      category,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      tuningId: selectedTuning,
      markers,
    };

    setSavedItems((current) => [item, ...current]);
    setName('');
    setTags('');
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
        <>
          <label style={styles.selectWrap}>
            <span style={styles.selectLabel}>Tuning</span>
            <select value={selectedTuning} onChange={(event) => setSelectedTuning(event.target.value)} style={styles.select}>
              {Object.entries(TUNINGS).map(([key, tuning]) => (
                <option key={key} value={key}>
                  {tuning.label}
                </option>
              ))}
            </select>
          </label>

          <SvgFretboard tuningNotes={tuningNotes} selected={svgSelected} onToggle={toggleSvgNote} />

          <section style={styles.saveCard}>
            <div style={styles.saveHeader}>Save selection</div>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" style={styles.input} />
            <select value={category} onChange={(event) => setCategory(event.target.value)} style={styles.select}>
              <option value="chord">Chord</option>
              <option value="scale">Scale</option>
            </select>
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags, comma separated" style={styles.input} />
            <button type="button" onClick={handleSave} style={styles.saveButton}>
              Save current selection ({Object.keys(svgSelected).length})
            </button>
          </section>

          <section style={styles.savedList}>
            {savedItems.map((item) => (
              <div key={item.id} style={styles.savedItem}>
                <div style={styles.savedName}>{item.name}</div>
                <div style={styles.savedMeta}>
                  {item.category} · {TUNINGS[item.tuningId].label} · {item.markers.length} markers
                </div>
                {item.tags.length > 0 ? <div style={styles.savedTags}>{item.tags.join(', ')}</div> : null}
              </div>
            ))}
          </section>
        </>
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
  selectWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    maxWidth: '560px',
  },
  selectLabel: { fontSize: '0.95rem', fontWeight: 700 },
  select: {
    padding: '12px 14px',
    fontSize: '1rem',
    borderRadius: '12px',
    border: '2px solid #111',
    background: '#fff',
  },
  svgWrap: { width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '8px' },
  svgBoard: { width: '100%', height: 'auto', display: 'block' },
  saveCard: {
    width: '100%',
    maxWidth: '560px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px',
    border: '2px solid #111',
    borderRadius: '16px',
    background: '#fff',
  },
  saveHeader: { fontSize: '1rem', fontWeight: 700 },
  input: {
    padding: '12px 14px',
    fontSize: '1rem',
    borderRadius: '12px',
    border: '2px solid #111',
    background: '#fff',
  },
  saveButton: {
    padding: '14px 16px',
    fontSize: '1rem',
    borderRadius: '12px',
    border: '2px solid #111',
    background: '#111',
    color: '#fff',
    cursor: 'pointer',
  },
  savedList: {
    width: '100%',
    maxWidth: '560px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  savedItem: {
    padding: '14px 16px',
    borderRadius: '14px',
    background: '#fff',
    border: '1px solid rgba(17,17,17,0.18)',
  },
  savedName: { fontWeight: 700 },
  savedMeta: { fontSize: '0.92rem', opacity: 0.75, marginTop: '4px' },
  savedTags: { fontSize: '0.92rem', marginTop: '6px' },
  hello: { fontSize: '1.4rem', margin: 0 },
};
