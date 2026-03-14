import { type IntervalName, intervalSemitones } from '@/data/music/intervals';
import { transposeNote } from '@/data/music/notes';
import { scaleTypes, type ScaleTypeName } from '@/data/music/scale-types';

export function buildScaleNotes(root: string, type: ScaleTypeName) {
  return scaleTypes[type].map((interval) => transposeNote(root, intervalSemitones[interval as IntervalName]));
}
