type Slice = {
  label: string;
  value: number;
  color: string;
};

type StatusDonutProps = {
  title: string;
  total: string;
  slices: Slice[];
};

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const startAngle = ((start - 90) * Math.PI) / 180;
  const endAngle = ((end - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const large = end - start > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export function StatusDonut({ title, total, slices }: StatusDonutProps) {
  const sum = slices.reduce((acc, s) => acc + s.value, 0);
  let cursor = 0;
  const arcs = slices.map((slice) => {
    const degrees = (slice.value / sum) * 360;
    const start = cursor;
    const end = cursor + degrees;
    cursor = end;
    return { ...slice, start, end, pct: Math.round((slice.value / sum) * 100) };
  });

  return (
    <section className="flex h-full flex-col justify-center rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h3 className="mb-4 shrink-0 text-sm font-semibold text-white">{title}</h3>
      <div className="flex flex-1 items-center gap-4">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-0">
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke="rgba(167,139,250,0.12)"
              strokeWidth="12"
            />
            {arcs.map((arc) => (
              <path
                key={arc.label}
                d={describeArc(50, 50, 34, arc.start + 1, arc.end - 1)}
                fill="none"
                stroke={arc.color}
                strokeWidth="12"
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-white">{total}</p>
            <p className="text-[10px] text-muted-2">Total</p>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2.5">
          {arcs.map((arc) => (
            <div key={arc.label} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: arc.color }}
                />
                <span className="text-muted">{arc.label}</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-white">{arc.value.toLocaleString()}</p>
                <p className="text-[10px] text-muted-2">{arc.pct}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
