import { Chord, ChordType, Interval, Note, Scale, ScaleType } from 'tonal';

export type EntryType = 'chord' | 'scale' | 'theory';

export type Pattern = {
  id: string;
  name: string;
  patternType: 'chord' | 'scale';
  baseFret: number;
  stringFrets: Array<number | 'x'>;
  fingers?: Array<number | null>;
  positions?: Array<{
    stringNumber: number;
    fret: number;
    note: string;
    interval?: string;
    isRoot?: boolean;
  }>;
};

export type LearningFocus =
  | 'chord-shape'
  | 'notes'
  | 'formula'
  | 'fretboard'
  | 'theory'
  | 'alternative-shapes';

export type LibraryEntry = {
  id: string;
  slug: string;
  type: EntryType;
  title: string;
  summary: string;
  tags: string[];
  rootNote?: string;
  quality?: string;
  scaleType?: string;
  formula?: string[];
  notes?: string[];
  topic?: string;
  content?: string[];
  relatedSlugs: string[];
  nextStepSlugs: string[];
  patterns?: Pattern[];
  recommendedFocus?: LearningFocus[];
};

const chromaticNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const standardTuning = ['E', 'A', 'D', 'G', 'B', 'E'];
const roots = ['C', 'D', 'E', 'F', 'G', 'A'];

const chordBlueprints = [
  { symbol: '', label: 'major', tags: ['triad', 'major'] },
  { symbol: 'm', label: 'minor', tags: ['triad', 'minor'] },
  { symbol: '7', label: 'dominant 7', tags: ['seventh', 'dominant'] },
  { symbol: 'maj7', label: 'major 7', tags: ['seventh', 'major'] },
  { symbol: 'm7', label: 'minor 7', tags: ['seventh', 'minor'] },
] as const;

const scaleBlueprints = [
  { name: 'major', tags: ['scale', 'major'] },
  { name: 'minor', tags: ['scale', 'minor'] },
  { name: 'major pentatonic', tags: ['scale', 'pentatonic', 'major'] },
  { name: 'minor pentatonic', tags: ['scale', 'pentatonic', 'minor'] },
  { name: 'blues', tags: ['scale', 'blues'] },
] as const;

const defaultChordFocus: LearningFocus[] = ['chord-shape', 'notes', 'formula', 'theory'];
const defaultScaleFocus: LearningFocus[] = ['notes', 'formula', 'fretboard', 'theory'];

export const focusOptions: Array<{ value: LearningFocus; label: string; description: string }> = [
  { value: 'chord-shape', label: 'Chord shape', description: 'Remember the physical shape and fingering.' },
  { value: 'notes', label: 'Notes', description: 'Know which notes are inside the chord or scale.' },
  { value: 'formula', label: 'Formula', description: 'Learn the interval recipe that builds it.' },
  { value: 'fretboard', label: 'Fretboard', description: 'Recognize roots and important positions on the neck.' },
  { value: 'theory', label: 'Theory explanation', description: 'Understand what the shape means and why it works.' },
  { value: 'alternative-shapes', label: 'Alternative shapes', description: 'Explore movable or alternate fingerings later.' },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatFormula(intervals: string[]) {
  return intervals.map((interval) => interval.replace('P', '').replace('M', '').replace('m', 'b'));
}

function makeChordEntry(root: string, symbol: string, label: string, tags: readonly string[]): LibraryEntry {
  const chord = Chord.get(`${root}${symbol}`);
  const formula = formatFormula(chord.intervals);
  return {
    id: `chord-${slugify(`${root}-${label}`)}`,
    slug: slugify(`${root}-${label}`),
    type: 'chord',
    title: chord.name || `${root} ${label}`,
    summary: `${root} ${label} built from Tonal.js chord data for notes, intervals, and naming.`,
    tags: ['tonal', ...tags],
    rootNote: root,
    quality: chord.quality || label,
    formula,
    notes: chord.notes,
    relatedSlugs: [],
    nextStepSlugs: [],
    recommendedFocus: defaultChordFocus,
    content: [
      `Generated from Tonal.js chord data for ${chord.symbol || `${root}${symbol}`}.`,
      `Chord tones: ${chord.notes.join(' • ')}.`,
      `Interval structure: ${formula.join(' • ')}.`,
    ],
  };
}

function scaleSlug(root: string, scaleName: string) {
  if (scaleName === 'minor pentatonic') return slugify(`minor-pentatonic-${root}`);
  return slugify(`${root}-${scaleName}-scale`);
}

function makeScaleEntry(root: string, scaleName: string, tags: readonly string[]): LibraryEntry {
  const scale = Scale.get(`${root} ${scaleName}`);
  const formula = formatFormula(scale.intervals);
  const slug = scaleSlug(root, scaleName);
  return {
    id: `scale-${slug}`,
    slug,
    type: 'scale',
    title: scale.name || `${root} ${scaleName}`,
    summary: `${root} ${scaleName} generated from Tonal.js scale data for notes and interval structure.`,
    tags: ['tonal', ...tags],
    rootNote: root,
    scaleType: scale.type || scaleName,
    formula,
    notes: scale.notes,
    relatedSlugs: [],
    nextStepSlugs: [],
    recommendedFocus: defaultScaleFocus,
    content: [
      `Generated from Tonal.js scale data for ${scale.name || `${root} ${scaleName}`}.`,
      `Scale tones: ${scale.notes.join(' • ')}.`,
      `Interval structure: ${formula.join(' • ')}.`,
    ],
  };
}

const chordEntries = roots.flatMap((root) => chordBlueprints.map((blueprint) => makeChordEntry(root, blueprint.symbol, blueprint.label, blueprint.tags)));
const scaleEntries = roots.flatMap((root) => scaleBlueprints.map((blueprint) => makeScaleEntry(root, blueprint.name, blueprint.tags)));

export const libraryEntries: LibraryEntry[] = [...chordEntries, ...scaleEntries].map((entry, index, entries) => {
  const sameRoot = entries.filter((candidate) => candidate.rootNote === entry.rootNote && candidate.slug !== entry.slug);
  const sameType = entries.filter((candidate) => candidate.type === entry.type);
  const next = sameType[(sameType.findIndex((candidate) => candidate.slug === entry.slug) + 1) % sameType.length];

  return {
    ...entry,
    relatedSlugs: sameRoot.slice(0, 3).map((candidate) => candidate.slug),
    nextStepSlugs: next ? [next.slug] : [],
  };
});

export const libraryBySlug = new Map(libraryEntries.map((entry) => [entry.slug, entry]));
export const defaultEntrySlug = libraryEntries[0]?.slug ?? 'c-major';

export const knowledgeEngineSummary = {
  chromaticNotes,
  intervalSystem: ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', '#5', '6', 'b7', '7'],
  chordTypes: Object.fromEntries(
    chordBlueprints.map((blueprint) => {
      const chord = ChordType.get(blueprint.symbol || 'major');
      return [blueprint.label, formatFormula(chord.intervals)];
    }),
  ),
  scaleTypes: Object.fromEntries(
    scaleBlueprints.map((blueprint) => {
      const scale = ScaleType.get(blueprint.name);
      return [blueprint.name, formatFormula(scale.intervals)];
    }),
  ),
  standardTuning,
  noteNames: Note.names(),
  tonalIntervals: Interval.names(),
};

export function getLibraryEntry(slug: string) {
  return libraryBySlug.get(slug);
}

export function getRelatedEntries(entry: LibraryEntry) {
  return entry.relatedSlugs
    .map((slug) => libraryBySlug.get(slug))
    .filter((value): value is LibraryEntry => Boolean(value));
}

export function getNextSteps(entry: LibraryEntry) {
  return entry.nextStepSlugs
    .map((slug) => libraryBySlug.get(slug))
    .filter((value): value is LibraryEntry => Boolean(value));
}
