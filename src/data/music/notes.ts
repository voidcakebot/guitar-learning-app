export const chromaticNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export type ChromaticNote = (typeof chromaticNotes)[number];

export function normalizeNote(note: string): ChromaticNote {
  const upper = note.toUpperCase();
  const flatMap: Record<string, ChromaticNote> = {
    DB: 'C#',
    EB: 'D#',
    GB: 'F#',
    AB: 'G#',
    BB: 'A#',
  };

  const normalized = flatMap[upper] ?? upper;
  if (!chromaticNotes.includes(normalized as ChromaticNote)) {
    throw new Error(`Unsupported note: ${note}`);
  }

  return normalized as ChromaticNote;
}

export function transposeNote(note: string, semitones: number): ChromaticNote {
  const normalized = normalizeNote(note);
  const index = chromaticNotes.indexOf(normalized);
  return chromaticNotes[(index + semitones + chromaticNotes.length) % chromaticNotes.length];
}
