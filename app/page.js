'use client';

import { useEffect, useMemo, useState } from 'react';

const TUNINGS = {
  standard: { label: 'Standard', notes: ['E', 'A', 'D', 'G', 'B', 'E'] },
  dadgad: { label: 'DADGAD', notes: ['D', 'A', 'D', 'G', 'A', 'D'] },
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
          <text key={note + index} x={stringXs[index]} y={20} textAnchor="middle" fontSize="14" fontWeight="700" fill="#161616">{note}</text>
        ))}
        {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => (
          <text key={`fret-label-${fret}`} x={18} y={rowCenterY(fret) + 4} textAnchor="middle" fontSize="12" fill="#51402c">{fret}</text>
        ))}
        {INLAYS.filter((fret) => fret !== 12).map((fret) => (
          <circle key={`inlay-${fret}`} cx={boardX + boardWidth / 2} cy={rowCenterY(fret)} r="9" fill="#fff7cf" stroke="rgba(60,45,20,0.22)" strokeWidth="2" />
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
          return <line key={`string-${index}`} x1={x} y1={boardY + rowHeight} x2={x} y2={boardY + boardHeight} stroke="#bfc3c9" strokeWidth={STRING_GAUGES[index]} strokeLinecap="round" />;
        })}
        <line x1={boardX} y1={boardY + rowHeight} x2={boardX + boardWidth} y2={boardY + rowHeight} stroke="#f4eee1" strokeWidth="8" />
        {Array.from({ length: FRET_COUNT + 1 }, (_, fret) =>
          tuningNotes.map((openNote, stringIndex) => {
            const id = `svg-${fret}-${stringIndex}`;
            const entry = selected[id];
            const active = !!entry;
            const muted = !!entry?.isMuted;
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
                {muted ? (
                  <text x={stringXs[stringIndex]} y={rowCenterY(fret) + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff" pointerEvents="none" style={{ userSelect: 'none' }}>X</text>
                ) : (
                  <text x={stringXs[stringIndex]} y={rowCenterY(fret) + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={active ? '#fff' : '#161616'} pointerEvents="none" style={{ userSelect: 'none' }}>
                    {getNote(openNote, fret)}
                  </text>
                )}
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState('note');
  const [selectedTuning, setSelectedTuning] = useState('standard');
  const [svgSelected, setSvgSelected] = useState({});
  const [name, setName] = useState('');
  const [category, setCategory] = useState('chord');
  const [tags, setTags] = useState('');
  const [savedItems, setSavedItems] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [ankiCards, setAnkiCards] = useState([]);
  const [activeLibraryItem, setActiveLibraryItem] = useState(null);
  const [ankiFront, setAnkiFront] = useState('');
  const [ankiBack, setAnkiBack] = useState('');
  const [ankiStatus, setAnkiStatus] = useState('');

  const tuningNotes = useMemo(() => TUNINGS[selectedTuning].notes, [selectedTuning]);

  useEffect(() => {
    async function loadData() {
      const [libraryResponse, cardsResponse] = await Promise.all([
        fetch('/api/library', { cache: 'no-store' }),
        fetch('/api/anki-cards', { cache: 'no-store' }),
      ]);
      const libraryData = await libraryResponse.json();
      const cardsData = await cardsResponse.json();
      if (libraryResponse.ok) setSavedItems(libraryData.items || []);
      if (cardsResponse.ok) setAnkiCards(cardsData.items || []);
    }
    loadData();
  }, []);

  const toggleSvgNote = (id, fretIndex, stringIndex) => {
    setSvgSelected((current) => {
      const next = { ...current };
      const existing = next[id];
      if (fretIndex === 0) {
        if (!existing) next[id] = { id, fretIndex, stringIndex, isMuted: false };
        else if (!existing.isMuted) next[id] = { id, fretIndex, stringIndex, isMuted: true };
        else delete next[id];
        return next;
      }
      if (existing) delete next[id];
      else next[id] = { id, fretIndex, stringIndex, isMuted: false };
      return next;
    });
  };

  const handleSave = async () => {
    const markers = Object.values(svgSelected);
    if (!name.trim() || markers.length === 0) return;
    const item = {
      id: makeUuid(),
      name: name.trim(),
      category,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      tuningId: selectedTuning,
      markers,
    };
    setSaveStatus('Saving...');
    const response = await fetch('/api/library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setSaveStatus(data.error || 'Save failed');
      return;
    }
    setSavedItems((current) => [item, ...current]);
    setName('');
    setTags('');
    setSaveStatus('Saved');
  };

  const openAnkiComposer = (item) => {
    if (activeLibraryItem?.id === item.id) {
      setActiveLibraryItem(null);
      setAnkiFront('');
      setAnkiBack('');
      setAnkiStatus('');
      return;
    }
    setActiveLibraryItem(item);
    setAnkiFront(item.name);
    setAnkiBack('');
    setAnkiStatus('');
  };

  const saveAnkiCard = async () => {
    if (!activeLibraryItem || !ankiFront.trim() || !ankiBack.trim()) return;
    const card = {
      id: makeUuid(),
      sourceShapeId: activeLibraryItem.id,
      front: ankiFront.trim(),
      back: ankiBack.trim(),
    };
    setAnkiStatus('Saving...');
    const response = await fetch('/api/anki-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setAnkiStatus(data.error || 'Save failed');
      return;
    }
    setAnkiCards((current) => [card, ...current]);
    setAnkiFront('');
    setAnkiBack('');
    setActiveLibraryItem(null);
    setAnkiStatus('Saved');
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>guitar Note</h1>
      <div style={styles.topNav}>
        <button type="button" style={mode === 'note' ? styles.navButtonActive : styles.navButton} onClick={() => setMode('note')}>Note</button>
        <button type="button" style={mode === 'library' ? styles.navButtonActive : styles.navButton} onClick={() => setMode('library')}>Library</button>
        <button type="button" style={mode === 'learn' ? styles.navButtonActive : styles.navButton} onClick={() => setMode('learn')}>Learn</button>
      </div>

      {mode === 'note' ? (
        <>
          <label style={styles.selectWrap}>
            <span style={styles.selectLabel}>Tuning</span>
            <select value={selectedTuning} onChange={(event) => setSelectedTuning(event.target.value)} style={styles.select}>
              {Object.entries(TUNINGS).map(([key, tuning]) => <option key={key} value={key}>{tuning.label}</option>)}
            </select>
          </label>
          <SvgFretboard tuningNotes={tuningNotes} selected={svgSelected} onToggle={toggleSvgNote} />
          <section style={styles.helpCard}>Open string behavior: tap once = open, tap again = muted, tap third time = clear.</section>
          <section style={styles.saveCard}>
            <div style={styles.saveHeader}>Save selection</div>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" style={styles.input} />
            <select value={category} onChange={(event) => setCategory(event.target.value)} style={styles.select}>
              <option value="chord">Chord</option>
              <option value="scale">Scale</option>
            </select>
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags, comma separated" style={styles.input} />
            <button type="button" onClick={handleSave} style={styles.saveButton}>Save current selection ({Object.keys(svgSelected).length})</button>
            {saveStatus ? <div style={styles.statusText}>{saveStatus}</div> : null}
          </section>
        </>
      ) : null}

      {mode === 'library' ? (
        <section style={styles.savedList}>
          {savedItems.length === 0 ? <div style={styles.emptyState}>No saved entries yet.</div> : null}
          {savedItems.map((item) => (
            <div key={item.id} style={styles.libraryItemWrap}>
              <button type="button" style={activeLibraryItem?.id === item.id ? styles.savedItemButtonActive : styles.savedItemButton} onClick={() => openAnkiComposer(item)}>
                <div style={styles.savedName}>{item.name}</div>
                <div style={styles.savedMeta}>{item.category} · {TUNINGS[item.tuningId]?.label || item.tuningId} · {item.markers.length} markers</div>
                {item.tags?.length > 0 ? <div style={styles.savedTags}>{item.tags.join(', ')}</div> : null}
              </button>
              {activeLibraryItem?.id === item.id ? (
                <section style={styles.popupCard}>
                  <div style={styles.saveHeader}>Create Anki card</div>
                  <textarea value={ankiFront} onChange={(event) => setAnkiFront(event.target.value)} placeholder="Front side" style={styles.textarea} />
                  <textarea value={ankiBack} onChange={(event) => setAnkiBack(event.target.value)} placeholder="Back side" style={styles.textarea} />
                  <button type="button" onClick={saveAnkiCard} style={styles.saveButton}>Save Anki card</button>
                  {ankiStatus ? <div style={styles.statusText}>{ankiStatus}</div> : null}
                </section>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {mode === 'learn' ? (
        <section style={styles.savedList}>
          {ankiCards.length === 0 ? <div style={styles.emptyState}>No saved Anki cards yet.</div> : null}
          {ankiCards.map((card) => (
            <div key={card.id} style={styles.savedItem}>
              <div style={styles.savedName}>{card.front}</div>
              <div style={styles.savedTags}>{card.back}</div>
            </div>
          ))}
        </section>
      ) : null}
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', background: '#f5f3ed', color: '#161616', fontFamily: 'Arial, sans-serif', padding: '24px 10px 40px', boxSizing: 'border-box' },
  title: { fontSize: '3rem', fontWeight: 700, margin: 0, textAlign: 'center' },
  topNav: { width: '100%', maxWidth: '560px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  navButton: { width: '100%', padding: '14px 8px', fontSize: '1rem', border: '2px solid #111', borderRadius: '14px', background: '#fff', cursor: 'pointer', boxSizing: 'border-box' },
  navButtonActive: { width: '100%', padding: '14px 8px', fontSize: '1rem', border: '2px solid #111', borderRadius: '14px', background: '#111', color: '#fff', cursor: 'pointer', boxSizing: 'border-box' },
  selectWrap: { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxWidth: '560px' },
  selectLabel: { fontSize: '0.95rem', fontWeight: 700 },
  select: { padding: '12px 14px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #111', background: '#fff' },
  svgWrap: { width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '8px' },
  svgBoard: { width: '100%', height: 'auto', display: 'block' },
  helpCard: { width: '100%', maxWidth: '560px', padding: '12px 14px', borderRadius: '12px', background: '#fff7cf', border: '1px solid rgba(17,17,17,0.14)', fontSize: '0.95rem', boxSizing: 'border-box' },
  saveCard: { width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', border: '2px solid #111', borderRadius: '16px', background: '#fff', boxSizing: 'border-box', overflow: 'hidden' },
  popupCard: { width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', border: '2px solid #111', borderRadius: '16px', background: '#fff', boxSizing: 'border-box' },
  saveHeader: { fontSize: '1rem', fontWeight: 700 },
  input: { width: '100%', padding: '12px 14px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #111', background: '#fff', boxSizing: 'border-box' },
  textarea: { width: '100%', minHeight: '120px', padding: '12px 14px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #111', background: '#fff', resize: 'vertical', boxSizing: 'border-box' },
  saveButton: { width: '100%', padding: '14px 16px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #111', background: '#111', color: '#fff', cursor: 'pointer', boxSizing: 'border-box' },
  statusText: { fontSize: '0.92rem', opacity: 0.8 },
  savedList: { width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '10px' },
  savedItem: { padding: '14px 16px', borderRadius: '14px', background: '#fff', border: '1px solid rgba(17,17,17,0.18)' },
  libraryItemWrap: { display: 'flex', flexDirection: 'column', gap: '8px' },
  savedItemButton: { width: '100%', padding: '14px 16px', borderRadius: '14px', background: '#fff', border: '1px solid rgba(17,17,17,0.18)', textAlign: 'left', cursor: 'pointer', boxSizing: 'border-box' },
  savedItemButtonActive: { width: '100%', padding: '14px 16px', borderRadius: '14px', background: '#eef4ff', border: '2px solid #111', textAlign: 'left', cursor: 'pointer', boxSizing: 'border-box' },
  savedName: { fontWeight: 700 },
  savedMeta: { fontSize: '0.92rem', opacity: 0.75, marginTop: '4px' },
  savedTags: { fontSize: '0.92rem', marginTop: '6px' },
  emptyState: { padding: '20px', borderRadius: '14px', background: '#fff', border: '1px solid rgba(17,17,17,0.18)', textAlign: 'center' },
};
