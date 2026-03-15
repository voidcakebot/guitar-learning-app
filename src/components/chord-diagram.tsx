import type { Pattern } from '@/lib/library';

const stringLabels = ['E', 'A', 'D', 'G', 'B', 'E'];

export function ChordDiagram({ pattern }: { pattern: Pattern }) {
  const width = 300;
  const height = 360;
  const left = 54;
  const right = width - 34;
  const top = 62;
  const bottom = height - 34;
  const stringGap = (right - left) / 5;
  const fretGap = (bottom - top) / 4;
  const minFret = Math.min(...pattern.stringFrets.filter((fret): fret is number => typeof fret === 'number' && fret > 0));
  const baseFret = minFret > 1 ? minFret : 1;
  const displayedFrets = Array.from({ length: 5 }, (_, index) => baseFret + index);

  return (
    <div className="card rounded-[1rem] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Chord shape</p>
          <p className="mt-1 text-sm text-slate-400">{pattern.name}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white">
          {baseFret === 1 ? 'Open' : `Fret ${baseFret}`}
        </div>
      </div>

      <div className="rounded-[1rem] border border-white/8 bg-[#080d12] p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-[300px]">
          <rect x={left - 14} y={top - 14} width={right - left + 28} height={bottom - top + 20} rx={14} fill="#111827" stroke="#334155" strokeWidth="2" />
          {baseFret === 1 ? <rect x={left - 4} y={top - 8} width={right - left + 8} height={6} rx={3} fill="#f8fafc" /> : null}

          {stringLabels.map((label, index) => {
            const x = left + index * stringGap;
            return (
              <g key={label + index}>
                <line x1={x} y1={top} x2={x} y2={bottom} stroke="#e5e7eb" strokeWidth={2.4} opacity={0.9} />
                <text x={x} y={28} textAnchor="middle" fontSize={12} fill="#e5e7eb" fontWeight={700}>{label}</text>
              </g>
            );
          })}

          {displayedFrets.map((fret, index) => {
            const y = top + index * fretGap;
            return (
              <g key={fret}>
                <line x1={left} y1={y} x2={right} y2={y} stroke="#cbd5e1" strokeWidth={2} opacity={0.8} />
                <text x={width - 10} y={y + 5} textAnchor="end" fontSize={11} fill="#94a3b8">{fret}</text>
              </g>
            );
          })}

          {pattern.stringFrets.map((fret, index) => {
            const x = left + index * stringGap;
            const finger = pattern.fingers?.[index];

            if (fret === 'x') {
              return (
                <g key={`muted-${index}`}>
                  <line x1={x - 7} y1={40} x2={x + 7} y2={54} stroke="#fda4af" strokeWidth={2.4} strokeLinecap="round" />
                  <line x1={x - 7} y1={54} x2={x + 7} y2={40} stroke="#fda4af" strokeWidth={2.4} strokeLinecap="round" />
                </g>
              );
            }

            if (fret === 0) {
              return <circle key={`open-${index}`} cx={x} cy={47} r={7} fill="none" stroke="#e5e7eb" strokeWidth={2} />;
            }

            const y = baseFret === 1 ? top + (fret - 1) * fretGap + fretGap * 0.5 : top + (fret - baseFret) * fretGap + fretGap * 0.5;
            return (
              <g key={`fret-${index}`}>
                <circle cx={x} cy={y} r={11} fill="#ffffff" />
                {finger ? <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill="#0f172a">{finger}</text> : null}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
