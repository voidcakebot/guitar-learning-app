import { tunings } from '@/data/guitar/tunings';
import { transposeNote } from '@/data/music/notes';

export function generateFretboardNotes(frets = 12, tuning: readonly string[] = tunings.standard) {
  return tuning.map((openNote, stringIndex) => ({
    stringNumber: tuning.length - stringIndex,
    notes: Array.from({ length: frets + 1 }, (_, fret) => ({
      fret,
      note: transposeNote(openNote, fret),
    })),
  }));
}
