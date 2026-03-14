type Position = {
  stringNumber: number;
  fret: number;
  label?: string;
  isRoot?: boolean;
};

export function Fretboard({ positions, frets = 12 }: { positions: Position[]; frets?: number }) {
  const strings = [6, 5, 4, 3, 2, 1];
  const width = 720;
  const height = 280;
  const left = 72;
  const right = width - 32;
  const top = 34;
  const bottom = height - 34;
  const stringGap = (bottom - top) / (strings.length - 1);
  const fretGap = (right - left) / frets;
  const dotFrets = [3, 5, 7, 9, 12].filter((fret) => fret <= frets);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/40">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">Fretboard view</p>
          <p className="text-xs text-slate-400">Full-neck target map. Roots are orange. Other target tones are blue.</p>
        </div>
        <div className="flex gap-3 text-xs text-slate-300">
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-500" /> Root</span>
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-sky-500" /> Tone</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <rect x={left} y={top} width={right - left} height={bottom - top} rx={22} fill="#111827" stroke="#1f2937" />
        {strings.map((string, index) => {
          const y = top + index * stringGap;
          return <line key={string} x1={left} y1={y} x2={right} y2={y} stroke="#64748b" strokeWidth={string >= 5 ? 2.8 : 1.8} />;
        })}
        {Array.from({ length: frets + 1 }).map((_, index) => {
          const x = left + index * fretGap;
          return <line key={index} x1={x} y1={top} x2={x} y2={bottom} stroke="#334155" strokeWidth={index === 0 ? 8 : 3} />;
        })}
        {dotFrets.map((fret) => {
          const x = left + (fret - 0.5) * fretGap;
          const isDouble = fret === 12;
          return isDouble ? (
            <g key={fret}>
              <circle cx={x} cy={top + stringGap * 1.5} r={8} fill="#1e293b" />
              <circle cx={x} cy={top + stringGap * 3.5} r={8} fill="#1e293b" />
            </g>
          ) : (
            <circle key={fret} cx={x} cy={(top + bottom) / 2} r={8} fill="#1e293b" />
          );
        })}
        {strings.map((string, index) => {
          const y = top + index * stringGap;
          return (
            <text key={`label-${string}`} x={24} y={y + 5} textAnchor="middle" fontSize={14} fill="#cbd5e1">
              {string}
            </text>
          );
        })}
        {Array.from({ length: frets }).map((_, index) => {
          const x = left + (index + 0.5) * fretGap;
          return (
            <text key={`fret-${index + 1}`} x={x} y={height - 8} textAnchor="middle" fontSize={12} fill="#94a3b8">
              {index + 1}
            </text>
          );
        })}
        {positions.map((position) => {
          const stringIndex = strings.findIndex((value) => value === position.stringNumber);
          if (stringIndex < 0) return null;
          const y = top + stringIndex * stringGap;
          const x = left + (position.fret === 0 ? 0.12 : position.fret - 0.5) * fretGap;
          return (
            <g key={`${position.stringNumber}-${position.fret}-${position.label}`}>
              <circle cx={x} cy={y} r={22} fill={position.isRoot ? '#f97316' : '#0ea5e9'} stroke="white" strokeOpacity="0.25" />
              <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="white">
                {position.label ?? '•'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
