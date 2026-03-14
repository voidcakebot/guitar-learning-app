import { Note } from 'tonal';

const standardTuning = ['E', 'A', 'D', 'G', 'B', 'E'];
const strings = [6, 5, 4, 3, 2, 1] as const;
const intervalLabels: Record<number, string> = {
  0: 'Root',
  1: 'b2',
  2: '2nd',
  3: 'b3',
  4: '3rd',
  5: '4th',
  6: 'b5',
  7: '5th',
  8: '#5',
  9: '6th',
  10: 'b7',
  11: '7th',
};

export type FretboardTonePosition = {
  stringNumber: number;
  fret: number;
  label: string;
  isRoot: boolean;
};

function noteChroma(note: string) {
  return Note.chroma(note);
}

function getIntervalLabel(noteChromaValue: number, rootChroma: number | null) {
  if (rootChroma === null) return '•';
  const semitones = (noteChromaValue - rootChroma + 12) % 12;
  return intervalLabels[semitones] ?? '•';
}

export function buildFretboardPositions({
  notes,
  rootNote,
  maxFret = 12,
}: {
  notes: string[];
  rootNote?: string;
  maxFret?: number;
}): FretboardTonePosition[] {
  const wanted = notes
    .map((note) => ({ note, chroma: noteChroma(note) }))
    .filter((item): item is { note: string; chroma: number } => item.chroma !== null);

  const rootChroma = rootNote ? noteChroma(rootNote) : null;

  return standardTuning.flatMap((openNote, index) => {
    const openChroma = noteChroma(openNote);
    if (openChroma === null) return [] as FretboardTonePosition[];

    const positions: FretboardTonePosition[] = [];

    for (let fret = 0; fret <= maxFret; fret += 1) {
      const fretChroma = (openChroma + fret) % 12;
      const match = wanted.find((item) => item.chroma === fretChroma);
      if (!match) continue;

      positions.push({
        stringNumber: strings[index],
        fret,
        label: getIntervalLabel(fretChroma, rootChroma),
        isRoot: rootChroma !== null && fretChroma === rootChroma,
      });
    }

    return positions;
  });
}
