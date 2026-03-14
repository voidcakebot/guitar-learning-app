import { Note } from 'tonal';

const standardTuning = ['E', 'A', 'D', 'G', 'B', 'E'];
const strings = [6, 5, 4, 3, 2, 1] as const;
export type FretboardTonePosition = {
  stringNumber: number;
  fret: number;
  label: string;
  isRoot: boolean;
};

function noteChroma(note: string) {
  return Note.chroma(note);
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
        label: match.note,
        isRoot: rootChroma !== null && fretChroma === rootChroma,
      });
    }

    return positions;
  });
}
