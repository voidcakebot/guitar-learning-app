export const scaleTypes = {
  major: ['1', '2', '3', '4', '5', '6', '7'],
  naturalMinor: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  majorPentatonic: ['1', '2', '3', '5', '6'],
  minorPentatonic: ['1', 'b3', '4', '5', 'b7'],
  blues: ['1', 'b3', '4', 'b5', '5', 'b7'],
} as const;

export type ScaleTypeName = keyof typeof scaleTypes;
