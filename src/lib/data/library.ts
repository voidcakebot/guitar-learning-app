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

export type LibraryEntry = {
  id: string;
  slug: string;
  type: EntryType;
  title: string;
  summary: string;
  difficulty: number;
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
};

export const libraryEntries: LibraryEntry[] = [
  {
    id: 'chord-c-major',
    slug: 'c-major',
    type: 'chord',
    title: 'C Major',
    summary: 'The foundational open C major chord with bright, stable harmony.',
    difficulty: 1,
    tags: ['open-chord', 'major', 'beginner'],
    rootNote: 'C',
    quality: 'major',
    formula: ['1', '3', '5'],
    notes: ['C', 'E', 'G'],
    relatedSlugs: ['c-major-scale', 'major-chord-construction'],
    nextStepSlugs: ['g-major', 'a-minor'],
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
    summary: 'A versatile open chord that anchors many beginner progressions.',
    difficulty: 1,
    tags: ['open-chord', 'major', 'beginner'],
    rootNote: 'G',
    quality: 'major',
    formula: ['1', '3', '5'],
    notes: ['G', 'B', 'D'],
    relatedSlugs: ['major-chord-construction', 'c-major'],
    nextStepSlugs: ['d-major', 'e-minor'],
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
    summary: 'A beginner-friendly minor chord with the same shape family as C major.',
    difficulty: 1,
    tags: ['open-chord', 'minor', 'beginner'],
    rootNote: 'A',
    quality: 'minor',
    formula: ['1', 'b3', '5'],
    notes: ['A', 'C', 'E'],
    relatedSlugs: ['natural-minor', 'c-major'],
    nextStepSlugs: ['e-minor', 'minor-pentatonic-a'],
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
    id: 'scale-c-major',
    slug: 'c-major-scale',
    type: 'scale',
    title: 'C Major Scale',
    summary: 'The no-sharps, no-flats major scale used to understand interval structure.',
    difficulty: 2,
    tags: ['scale', 'major', 'theory'],
    rootNote: 'C',
    scaleType: 'major',
    formula: ['1', '2', '3', '4', '5', '6', '7'],
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    relatedSlugs: ['c-major', 'major-chord-construction'],
    nextStepSlugs: ['minor-pentatonic-a'],
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
    summary: 'A high-value beginner scale for riffs, improvisation, and pattern awareness.',
    difficulty: 2,
    tags: ['scale', 'minor', 'pentatonic'],
    rootNote: 'A',
    scaleType: 'minor pentatonic',
    formula: ['1', 'b3', '4', '5', 'b7'],
    notes: ['A', 'C', 'D', 'E', 'G'],
    relatedSlugs: ['a-minor', 'natural-minor'],
    nextStepSlugs: ['c-major-scale'],
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
    difficulty: 1,
    tags: ['theory', 'intervals', 'triads'],
    topic: 'chord construction',
    relatedSlugs: ['c-major', 'g-major', 'c-major-scale'],
    nextStepSlugs: ['natural-minor'],
    content: [
      'A major chord is built from the root, major third, and perfect fifth.',
      'On guitar, different voicings still express the same interval formula: 1-3-5.',
      'Knowing the formula makes it easier to recognize movable shapes later.'
    ]
  },
  {
    id: 'theory-natural-minor',
    slug: 'natural-minor',
    type: 'theory',
    title: 'Natural Minor Basics',
    summary: 'The minor sound comes from flattening the 3rd, 6th, and 7th degrees.',
    difficulty: 2,
    tags: ['theory', 'minor', 'scale-construction'],
    topic: 'scale construction',
    relatedSlugs: ['a-minor', 'minor-pentatonic-a'],
    nextStepSlugs: ['major-chord-construction'],
    content: [
      'The natural minor formula is 1-2-b3-4-5-b6-b7.',
      'Its darker color is especially obvious when you compare it directly with the major scale.',
      'Minor pentatonic is a simplified subset that is often easier to start practicing.'
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
