export type NeckViewPosition = {
  stringNumber: number;
  fret: number;
  label?: string;
  isRoot?: boolean;
};

export const neckPositionWindows = [
  { key: 'open', label: 'Open', start: 0, end: 4 },
  { key: 'pos-1', label: '1', start: 1, end: 5 },
  { key: 'pos-2', label: '2', start: 2, end: 6 },
  { key: 'pos-3', label: '3', start: 3, end: 7 },
  { key: 'pos-4', label: '4', start: 4, end: 8 },
  { key: 'pos-5', label: '5', start: 5, end: 9 },
  { key: 'pos-7', label: '7', start: 7, end: 11 },
  { key: 'pos-9', label: '9', start: 9, end: 12 },
] as const;

export type NeckPositionWindow = (typeof neckPositionWindows)[number];
export type NeckPositionWindowKey = NeckPositionWindow['key'];

export function getNeckPositionWindow(key: NeckPositionWindowKey) {
  return neckPositionWindows.find((window) => window.key === key) ?? neckPositionWindows[0];
}

export function filterPositionsForWindow(positions: NeckViewPosition[], window: NeckPositionWindow) {
  return positions.filter((position) => position.fret >= window.start && position.fret <= window.end);
}

