type Position = {
  stringNumber: number;
  fret: number;
  label?: string;
  isRoot?: boolean;
};

export function Fretboard({ positions, frets = 5 }: { positions: Position[]; frets?: number }) {
  const strings = [6, 5, 4, 3, 2, 1];
  const width = 520;
  const height = 180;
  const left = 40;
  const right = width - 20;
  const top = 20;
  const bottom = height - 20;
  const stringGap = (bottom - top) / (strings.length - 1);
  const fretGap = (right - left) / frets;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-2">
      {strings.map((string, index) => {
        const y = top + index * stringGap;
        return <line key={string} x1={left} y1={y} x2={right} y2={y} stroke="#475569" strokeWidth={2} />;
      })}
      {Array.from({ length: frets + 1 }).map((_, index) => {
        const x = left + index * fretGap;
        return <line key={index} x1={x} y1={top} x2={x} y2={bottom} stroke="#334155" strokeWidth={index === 0 ? 4 : 2} />;
      })}
      {positions.map((position) => {
        const stringIndex = strings.findIndex((value) => value === position.stringNumber);
        if (stringIndex < 0) return null;
        const y = top + stringIndex * stringGap;
        const x = left + (position.fret === 0 ? 0.2 : position.fret - 0.5) * fretGap;
        return (
          <g key={`${position.stringNumber}-${position.fret}-${position.label}`}>
            <circle cx={x} cy={y} r={16} fill={position.isRoot ? '#f97316' : '#0ea5e9'} />
            <text x={x} y={y + 5} textAnchor="middle" fontSize={12} fill="white">
              {position.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
