import { chordPatternFamilies } from '@/data/guitar/chord-patterns';
import { scalePatternFamilies } from '@/data/guitar/scale-patterns';
import { tunings } from '@/data/guitar/tunings';
import { chordTypes } from '@/data/music/chord-types';
import { intervalSystem } from '@/data/music/intervals';
import { scaleTypes } from '@/data/music/scale-types';
import { theoryTopics } from '@/data/music/theory';
import { buildChordNotes } from '@/lib/music/chord-generator';
import { buildScaleNotes } from '@/lib/music/scale-generator';

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

const defaultFocus: LearningFocus[] = ['chord-shape', 'notes', 'formula', 'fretboard', 'theory'];

export const focusOptions: Array<{ value: LearningFocus; label: string; description: string }> = [
  { value: 'chord-shape', label: 'Chord shape', description: 'Remember the physical shape and fingering.' },
  { value: 'notes', label: 'Notes', description: 'Know which notes are inside the chord or scale.' },
  { value: 'formula', label: 'Formula', description: 'Learn the interval recipe that builds it.' },
  { value: 'fretboard', label: 'Fretboard', description: 'Recognize roots and important positions on the neck.' },
  { value: 'theory', label: 'Theory explanation', description: 'Understand what the shape means and why it works.' },
  { value: 'alternative-shapes', label: 'Alternative shapes', description: 'Explore movable or alternate fingerings later.' }];

export const knowledgeEngineSummary = {
  chromaticNotes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  intervalSystem,
  chordTypes,
  scaleTypes,
  standardTuning: tunings.standard,
  chordPatternFamilies,
  scalePatternFamilies,
  theoryTopics,
};

export const libraryEntries: LibraryEntry[] = [
  {
    id: 'chord-c-major',
    slug: 'c-major',
    type: 'chord',
    title: 'C Major',
    summary: 'The foundational open C major chord with bright, stable harmony.',
    tags: ['open-chord', 'major'],
    rootNote: 'C',
    quality: 'major',
    formula: [...chordTypes.major],
    notes: buildChordNotes('C', 'major'),
    relatedSlugs: ['c-major-scale', 'major-chord-construction'],
    nextStepSlugs: ['g-major', 'a-minor'],
    recommendedFocus: defaultFocus,
    patterns: [
      {
        id: 'pattern-c-major-open',
        name: 'Open Position',
        patternType: 'chord',
        baseFret: 1,
        stringFrets: ['x', 3, 2, 0, 1, 0],
        fingers: [null, 3, 2, 0, 1, 0],
        positions: [
          { stringNumber: 5, fret: 3, note: 'C', interval: '1', isRoot: true },
          { stringNumber: 4, fret: 2, note: 'E', interval: '3' },
          { stringNumber: 3, fret: 0, note: 'G', interval: '5' },
          { stringNumber: 2, fret: 1, note: 'C', interval: '1', isRoot: true },
          { stringNumber: 1, fret: 0, note: 'E', interval: '3' }
        ]
      }
    ]
  },
  {
    id: 'chord-g-major',
    slug: 'g-major',
    type: 'chord',
    title: 'G Major',
    summary: 'A versatile open chord that anchors many classic progressions.',
    tags: ['open-chord', 'major'],
    rootNote: 'G',
    quality: 'major',
    formula: [...chordTypes.major],
    notes: buildChordNotes('G', 'major'),
    relatedSlugs: ['major-chord-construction', 'c-major', 'd-major'],
    nextStepSlugs: ['d-major', 'e-minor'],
    recommendedFocus: defaultFocus,
    patterns: [
      {
        id: 'pattern-g-major-open',
        name: 'Open Position',
        patternType: 'chord',
        baseFret: 1,
        stringFrets: [3, 2, 0, 0, 0, 3],
        fingers: [2, 1, 0, 0, 0, 3],
        positions: [
          { stringNumber: 6, fret: 3, note: 'G', interval: '1', isRoot: true },
          { stringNumber: 5, fret: 2, note: 'B', interval: '3' },
          { stringNumber: 4, fret: 0, note: 'D', interval: '5' },
          { stringNumber: 3, fret: 0, note: 'G', interval: '1', isRoot: true },
          { stringNumber: 2, fret: 0, note: 'B', interval: '3' },
          { stringNumber: 1, fret: 3, note: 'G', interval: '1', isRoot: true }
        ]
      }
    ]
  },
  {
    id: 'chord-a-minor',
    slug: 'a-minor',
    type: 'chord',
    title: 'A Minor',
    summary: 'A familiar minor chord with the same shape family as C major.',
    tags: ['open-chord', 'minor'],
    rootNote: 'A',
    quality: 'minor',
    formula: [...chordTypes.minor],
    notes: buildChordNotes('A', 'minor'),
    relatedSlugs: ['natural-minor', 'c-major', 'minor-pentatonic-a'],
    nextStepSlugs: ['e-minor', 'minor-pentatonic-a'],
    recommendedFocus: defaultFocus,
    patterns: [
      {
        id: 'pattern-a-minor-open',
        name: 'Open Position',
        patternType: 'chord',
        baseFret: 1,
        stringFrets: ['x', 0, 2, 2, 1, 0],
        fingers: [null, 0, 2, 3, 1, 0],
        positions: [
          { stringNumber: 5, fret: 0, note: 'A', interval: '1', isRoot: true },
          { stringNumber: 4, fret: 2, note: 'E', interval: '5' },
          { stringNumber: 3, fret: 2, note: 'A', interval: '1', isRoot: true },
          { stringNumber: 2, fret: 1, note: 'C', interval: 'b3' },
          { stringNumber: 1, fret: 0, note: 'E', interval: '5' }
        ]
      }
    ]
  },
  {
    id: 'chord-e-minor',
    slug: 'e-minor',
    type: 'chord',
    title: 'E Minor',
    summary: 'One of the easiest open chords and a perfect first minor sound.',
    tags: ['open-chord', 'minor'],
    rootNote: 'E',
    quality: 'minor',
    formula: [...chordTypes.minor],
    notes: buildChordNotes('E', 'minor'),
    relatedSlugs: ['g-major', 'natural-minor'],
    nextStepSlugs: ['d-major', 'a-minor'],
    recommendedFocus: defaultFocus,
    patterns: [
      {
        id: 'pattern-e-minor-open',
        name: 'Open Position',
        patternType: 'chord',
        baseFret: 1,
        stringFrets: [0, 2, 2, 0, 0, 0],
        fingers: [0, 2, 3, 0, 0, 0],
        positions: [
          { stringNumber: 6, fret: 0, note: 'E', interval: '1', isRoot: true },
          { stringNumber: 5, fret: 2, note: 'B', interval: '5' },
          { stringNumber: 4, fret: 2, note: 'E', interval: '1', isRoot: true },
          { stringNumber: 3, fret: 0, note: 'G', interval: 'b3' },
          { stringNumber: 2, fret: 0, note: 'B', interval: '5' },
          { stringNumber: 1, fret: 0, note: 'E', interval: '1', isRoot: true }
        ]
      }
    ]
  },
  {
    id: 'chord-d-major',
    slug: 'd-major',
    type: 'chord',
    title: 'D Major',
    summary: 'A bright upper-string chord that appears in countless songs.',
    tags: ['open-chord', 'major'],
    rootNote: 'D',
    quality: 'major',
    formula: [...chordTypes.major],
    notes: buildChordNotes('D', 'major'),
    relatedSlugs: ['g-major', 'major-chord-construction'],
    nextStepSlugs: ['c-major', 'g-major'],
    recommendedFocus: defaultFocus,
    patterns: [
      {
        id: 'pattern-d-major-open',
        name: 'Open Position',
        patternType: 'chord',
        baseFret: 1,
        stringFrets: ['x', 'x', 0, 2, 3, 2],
        fingers: [null, null, 0, 1, 3, 2],
        positions: [
          { stringNumber: 4, fret: 0, note: 'D', interval: '1', isRoot: true },
          { stringNumber: 3, fret: 2, note: 'A', interval: '5' },
          { stringNumber: 2, fret: 3, note: 'D', interval: '1', isRoot: true },
          { stringNumber: 1, fret: 2, note: 'F#', interval: '3' }
        ]
      }
    ]
  },
  {
    id: 'scale-c-major',
    slug: 'c-major-scale',
    type: 'scale',
    title: 'C Major Scale',
    summary: 'The no-sharps, no-flats major scale used to understand interval structure.',
    tags: ['scale', 'major', 'theory'],
    rootNote: 'C',
    scaleType: 'major',
    formula: [...scaleTypes.major],
    notes: buildScaleNotes('C', 'major'),
    relatedSlugs: ['c-major', 'major-chord-construction', 'intervals-on-guitar'],
    nextStepSlugs: ['minor-pentatonic-a'],
    recommendedFocus: ['notes', 'formula', 'fretboard', 'theory'],
    patterns: [
      {
        id: 'pattern-c-major-one-octave',
        name: 'One-Octave Open Position',
        patternType: 'scale',
        baseFret: 1,
        stringFrets: ['x', 3, 2, 0, 1, 0],
        positions: [
          { stringNumber: 5, fret: 3, note: 'C', interval: '1', isRoot: true },
          { stringNumber: 4, fret: 0, note: 'D', interval: '2' },
          { stringNumber: 4, fret: 2, note: 'E', interval: '3' },
          { stringNumber: 3, fret: 0, note: 'G', interval: '5' },
          { stringNumber: 3, fret: 2, note: 'A', interval: '6' },
          { stringNumber: 2, fret: 0, note: 'B', interval: '7' },
          { stringNumber: 2, fret: 1, note: 'C', interval: '1', isRoot: true }
        ]
      }
    ]
  },
  {
    id: 'scale-a-minor-pentatonic',
    slug: 'minor-pentatonic-a',
    type: 'scale',
    title: 'A Minor Pentatonic',
    summary: 'A high-value scale for riffs, improvisation, and pattern awareness.',
    tags: ['scale', 'minor', 'pentatonic'],
    rootNote: 'A',
    scaleType: 'minor pentatonic',
    formula: [...scaleTypes.minorPentatonic],
    notes: buildScaleNotes('A', 'minorPentatonic'),
    relatedSlugs: ['a-minor', 'natural-minor', 'caged-system-basics'],
    nextStepSlugs: ['c-major-scale'],
    recommendedFocus: ['notes', 'formula', 'fretboard', 'theory'],
    patterns: [
      {
        id: 'pattern-a-minor-pentatonic-box-1',
        name: 'Box 1',
        patternType: 'scale',
        baseFret: 5,
        stringFrets: [5, 5, 5, 5, 5, 5],
        positions: [
          { stringNumber: 6, fret: 5, note: 'A', interval: '1', isRoot: true },
          { stringNumber: 6, fret: 8, note: 'C', interval: 'b3' },
          { stringNumber: 5, fret: 5, note: 'D', interval: '4' },
          { stringNumber: 5, fret: 7, note: 'E', interval: '5' },
          { stringNumber: 4, fret: 5, note: 'G', interval: 'b7' },
          { stringNumber: 4, fret: 7, note: 'A', interval: '1', isRoot: true }
        ]
      }
    ]
  },
  {
    id: 'theory-major-chord-construction',
    slug: 'major-chord-construction',
    type: 'theory',
    title: 'Major Chord Construction',
    summary: 'How major triads are built from the 1st, 3rd, and 5th scale degrees.',
    tags: ['theory', 'intervals', 'triads'],
    topic: 'chord construction',
    formula: [...chordTypes.major],
    relatedSlugs: ['c-major', 'g-major', 'c-major-scale'],
    nextStepSlugs: ['minor-chord-construction'],
    recommendedFocus: ['formula', 'theory', 'notes'],
    content: [
      'A major chord is built from the root, major third, and perfect fifth.',
      'On guitar, different voicings still express the same interval formula: 1-3-5.',
      'Knowing the formula makes it easier to recognize movable shapes later.'
    ]
  },
  {
    id: 'theory-minor-chord-construction',
    slug: 'minor-chord-construction',
    type: 'theory',
    title: 'Minor Chord Construction',
    summary: 'Minor triads keep the 5th but flatten the 3rd for a darker sound.',
    tags: ['theory', 'intervals', 'triads'],
    topic: 'chord construction',
    formula: [...chordTypes.minor],
    relatedSlugs: ['a-minor', 'e-minor', 'natural-minor'],
    nextStepSlugs: ['natural-minor'],
    recommendedFocus: ['formula', 'theory', 'notes'],
    content: [
      'A minor chord changes only one ingredient from major: the 3rd becomes a minor 3rd.',
      'That one interval shift changes the emotional color dramatically.',
      'Compare C major and A minor shapes to hear how interval choices shape mood.'
    ]
  },
  {
    id: 'theory-natural-minor',
    slug: 'natural-minor',
    type: 'theory',
    title: 'Natural Minor Basics',
    summary: 'The minor sound comes from flattening the 3rd, 6th, and 7th degrees.',
    tags: ['theory', 'minor', 'scale-construction'],
    topic: 'scale construction',
    formula: [...scaleTypes.naturalMinor],
    relatedSlugs: ['a-minor', 'minor-pentatonic-a', 'minor-chord-construction'],
    nextStepSlugs: ['intervals-on-guitar'],
    recommendedFocus: ['formula', 'theory', 'notes'],
    content: [
      'The natural minor formula is 1-2-b3-4-5-b6-b7.',
      'Its darker color is especially obvious when you compare it directly with the major scale.',
      'Minor pentatonic is a simplified subset that is often easier to start practicing.'
    ]
  },
  {
    id: 'theory-intervals-on-guitar',
    slug: 'intervals-on-guitar',
    type: 'theory',
    title: 'Intervals on Guitar',
    summary: 'Intervals are the distance language behind chords, scales, and fretboard logic.',
    tags: ['theory', 'intervals'],
    topic: 'intervals',
    formula: [...intervalSystem],
    relatedSlugs: ['major-chord-construction', 'natural-minor', 'c-major-scale'],
    nextStepSlugs: ['caged-system-basics'],
    recommendedFocus: ['formula', 'theory', 'fretboard'],
    content: [
      'Intervals name the distance from the root note to every other note.',
      'Chord formulas and scale formulas are just interval recipes.',
      'Once you see intervals on the fretboard, shapes become easier to move and reuse.'
    ]
  },
  {
    id: 'theory-caged-system-basics',
    slug: 'caged-system-basics',
    type: 'theory',
    title: 'CAGED System Basics',
    summary: 'CAGED connects open chord shapes to movable fretboard landmarks.',
    tags: ['theory', 'caged', 'fretboard'],
    topic: 'fretboard mapping',
    relatedSlugs: ['c-major', 'g-major', 'a-minor', 'intervals-on-guitar'],
    nextStepSlugs: ['minor-pentatonic-a'],
    recommendedFocus: ['fretboard', 'theory', 'alternative-shapes'],
    content: [
      'The CAGED system uses five familiar open-shape families to navigate the neck.',
      'It helps you connect chords, scales, and arpeggios instead of memorizing isolated boxes.',
      'For V1, treat it as a map concept, not a full advanced curriculum yet.'
    ]
  },
  {
    id: 'theory-basic-harmonization',
    slug: 'basic-harmonization',
    type: 'theory',
    title: 'Basic Harmonization',
    summary: 'Harmonization explains how scales produce families of chords that work together.',
    tags: ['theory', 'harmonization', 'relationships'],
    topic: 'basic harmonization',
    relatedSlugs: ['c-major-scale', 'major-chord-construction', 'natural-minor'],
    nextStepSlugs: ['caged-system-basics'],
    recommendedFocus: ['theory', 'formula', 'notes'],
    content: [
      'Harmonizing a scale means building chords from each degree of the scale.',
      'This is how progressions start to feel logical instead of random.',
      'At this stage, it is enough to see that chords and scales belong to the same note world.'
    ]
  }
];

export const libraryBySlug = new Map(libraryEntries.map((entry) => [entry.slug, entry]));
export const defaultEntrySlug = 'c-major';

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

