export const tunings = {
  standard: ['E', 'A', 'D', 'G', 'B', 'E'],
} as const;

export type TuningName = keyof typeof tunings;
