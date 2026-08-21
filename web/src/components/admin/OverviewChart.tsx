"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { webApi } from "@/lib/api";

const TABS = ["Deposits", "Withdrawals", "Earnings"] as const;
type Tab = (typeof TABS)[number];

const RANGES = [
  { value: "today", label: "Today" },
  { value: "week",  label: "This Week" },
  { value: "month", label: "This Month" },
] as const;
type Range = (typeof RANGES)[number]["value"];

const TAB_KEY: Record<Tab, "deposits" | "withdrawals" | "earnings"> = {
  Deposits:    "deposits",
  Withdrawals: "withdrawals",
  Earnings:    "earnings",
};

const TAB_COLOR: Record<Tab, string> = {
  Deposits:    "#a855f7",
  Withdrawals: "#38bdf8",
  Earnings:    "#34d399",
};

const TAB_FILL_START: Record<Tab, string> = {
  Deposits:    "#7b2cff",
  Withdrawals: "#0ea5e9",
  Earnings:    "#10b981",
};

type Point = { label: string; deposits: number; withdrawals: number; earnings: number };

const W = 560;
const H = 100;
const PAD = 8;

function buildPath(values: number[]): string {
  if (values.length === 0) return "";
  const max = Math.max(...values, 1);
  const step = values.length === 1 ? 0 : (W - PAD * 2) / (values.length - 1);
  return values
    .map((v, i) => {
      const x = PAD + i * step;
      const y = PAD + (1 - v / max) * (H - PAD * 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildArea(path: string, values: number[]): string {
  if (!path || values.length === 0) return "";
  const max = Math.max(...values, 1);
  const step = values.length === 1 ? 0 : (W - PAD * 2) / (values.length - 1);
  const lastX = PAD + (values.length - 1) * step;
  return `${path} L ${lastX.toFixed(2)} ${(H - PAD).toFixed(2)} L ${PAD} ${(H - PAD).toFixed(2)} Z`;
}

function formatCurrency(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(2)}`;
}

export function OverviewChart() {
  const [tab, setTab]     = useState<Tab>("Deposits");
  const [range, setRange] = useState<Range>("today");
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setLoading(true);
    webApi.get(`/admin/chart-data?range=${range}`)
      .then((data: any) => setPoints(data.points ?? []))
      .catch(() => setPoints([]))
      .finally(() => setLoading(false));
  }, [range]);

  const key = TAB_KEY[tab];
  const values = useMemo(() => points.map(p => p[key]), [points, key]);
  const path  = useMemo(() => buildPath(values), [values]);
  const area  = useMemo(() => buildArea(path, values), [path, values]);

  const color     = TAB_COLOR[tab];
  const fillStart = TAB_FILL_START[tab];
  const gradId    = `fill-${tab.toLowerCase()}`;

  const max = Math.max(...values, 1);
  const step = values.length <= 1 ? 0 : (W - PAD * 2) / (values.length - 1);

  const totalValue = values.reduce((a, b) => a + b, 0);

  // compute dot positions for hover
  const dots = values.map((v, i) => ({
    x: PAD + i * step,
    y: PAD + (1 - v / max) * (H - PAD * 2),
    value: v,
    label: points[i]?.label ?? "",
  }));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || dots.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * W;
    let closest = 0;
    let minDist = Infinity;
    dots.forEach((d, i) => {
      const dist = Math.abs(d.x - mouseX);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setHoveredIdx(closest);
  };

  return (
    <section className="flex h-full min-h-[420px] flex-col rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-5 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Overview</h2>
          <p className="text-xs text-muted-2">Platform cashflow performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab switcher */}
          <div className="flex rounded-xl border border-border bg-bg-deep p-1">
            {TABS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  tab === item ? "bg-purple text-white" : "text-muted hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {/* Range dropdown */}
          <select
            className="h-9 rounded-xl border border-border bg-bg-deep px-3 text-xs text-muted outline-none cursor-pointer"
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            aria-label="Time range"
          >
            {RANGES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary pill */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg font-bold text-white">{formatCurrency(totalValue)}</span>
        <span className="text-xs text-muted-2">total {tab.toLowerCase()}</span>
        {loading && <span className="ml-1 text-[10px] text-muted-2 animate-pulse">Loading…</span>}
      </div>

      <div
        className="relative min-h-[250px] w-full flex-1 overflow-hidden rounded-xl bg-gradient-to-b from-bg-deep/60 to-transparent"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {loading || values.length === 0 ? (
          <div className="flex h-full min-h-[200px] items-center justify-center">
            <p className="text-xs text-muted-2">
              {loading ? "Loading chart…" : "No data for this period"}
            </p>
          </div>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="h-full w-full cursor-crosshair"
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
          >
            {/* Gridlines */}
            {[20, 40, 60, 80].map((y) => (
              <line
                key={y}
                x1="0" y1={y} x2={W} y2={y}
                stroke="rgba(167,139,250,0.08)"
                strokeWidth="0.5"
              />
            ))}

            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={fillStart} stopOpacity="0.4" />
                <stop offset="100%" stopColor={fillStart} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path d={area} fill={`url(#${gradId})`} />

            {/* Line */}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dots */}
            {dots.map((d, i) => (
              <g key={i}>
                <circle
                  cx={d.x} cy={d.y} r={hoveredIdx === i ? 4 : 2.5}
                  fill={color}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="1"
                  style={{ transition: "r 0.15s" }}
                />
              </g>
            ))}

            {/* Hover tooltip vertical line */}
            {hoveredIdx !== null && dots[hoveredIdx] && (
              <line
                x1={dots[hoveredIdx].x} y1={PAD}
                x2={dots[hoveredIdx].x} y2={H - PAD}
                stroke={color}
                strokeWidth="0.8"
                strokeDasharray="3 2"
                opacity="0.5"
              />
            )}
          </svg>
        )}

        {/* Tooltip card */}
        {hoveredIdx !== null && dots[hoveredIdx] && !loading && (
          <div
            className="pointer-events-none absolute z-10 rounded-xl border border-border bg-bg-deep/95 px-3 py-2 shadow-lg backdrop-blur text-left"
            style={{
              top: "12px",
              left: `clamp(8px, calc(${(dots[hoveredIdx].x / W) * 100}% - 60px), calc(100% - 130px))`,
            }}
          >
            <p className="text-[10px] text-muted-2">{dots[hoveredIdx].label}</p>
            <p className="text-sm font-semibold text-white">{formatCurrency(dots[hoveredIdx].value)}</p>
          </div>
        )}
      </div>

      {/* X-axis labels */}
      {!loading && values.length > 0 && (
        <div className="mt-1 flex justify-between px-1">
          {dots
            .filter((_, i) => values.length <= 7 || i % Math.ceil(values.length / 7) === 0 || i === values.length - 1)
            .map((d, i) => (
              <span key={i} className="text-[9px] text-muted-2 truncate">{d.label}</span>
            ))}
        </div>
      )}
    </section>
  );
}
