export const chordTypes = {
  major: ['1', '3', '5'],
  minor: ['1', 'b3', '5'],
  maj7: ['1', '3', '5', '7'],
  min7: ['1', 'b3', '5', 'b7'],
  dominant7: ['1', '3', '5', 'b7'],
  sus2: ['1', '2', '5'],
  sus4: ['1', '4', '5'],
  diminished: ['1', 'b3', 'b5'],
  augmented: ['1', '3', '#5'],
} as const;

export type ChordTypeName = keyof typeof chordTypes;
