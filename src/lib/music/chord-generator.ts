import { chordTypes, type ChordTypeName } from '@/data/music/chord-types';
import { type IntervalName, intervalSemitones } from '@/data/music/intervals';
import { transposeNote } from '@/data/music/notes';

export function buildChordNotes(root: string, type: ChordTypeName) {
  return chordTypes[type].map((interval) => transposeNote(root, intervalSemitones[interval as IntervalName]));
}
