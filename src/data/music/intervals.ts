export const intervalSemitones = {
  '1': 0,
  b2: 1,
  '2': 2,
  b3: 3,
  '3': 4,
  '4': 5,
  '#4': 6,
  b5: 6,
  '5': 7,
  '#5': 8,
  b6: 8,
  '6': 9,
  b7: 10,
  '7': 11,
} as const;

export const intervalSystem = Object.keys(intervalSemitones) as Array<keyof typeof intervalSemitones>;

export type IntervalName = keyof typeof intervalSemitones;
