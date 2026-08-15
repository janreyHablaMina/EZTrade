"use client";

import { useMemo, useState } from "react";

const TABS = ["Deposits", "Withdrawals", "Earnings"] as const;

const POINTS = [
  { x: 0, y: 78 },
  { x: 40, y: 62 },
  { x: 80, y: 70 },
  { x: 120, y: 48 },
  { x: 160, y: 58 },
  { x: 200, y: 36 },
  { x: 240, y: 52 },
  { x: 280, y: 30 },
  { x: 320, y: 42 },
  { x: 360, y: 24 },
  { x: 400, y: 38 },
  { x: 440, y: 18 },
  { x: 480, y: 28 },
  { x: 520, y: 14 },
  { x: 560, y: 22 },
];

export function OverviewChart() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Deposits");

  const path = useMemo(() => {
    return POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, []);

  const area = useMemo(() => {
    return `${path} L 560 100 L 0 100 Z`;
  }, [path]);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Overview</h2>
          <p className="text-xs text-muted-2">Platform cashflow performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-border bg-bg-deep p-1">
            {TABS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  tab === item
                    ? "bg-purple text-white"
                    : "text-muted hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <select
            className="h-9 rounded-xl border border-border bg-bg-deep px-3 text-xs text-muted outline-none"
            defaultValue="month"
            aria-label="Time range"
          >
            <option value="month">This Month</option>
            <option value="week">This Week</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="relative h-[250px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-purple/10 to-transparent">
        <svg viewBox="0 0 560 100" className="h-full w-full" preserveAspectRatio="none">
          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="560"
              y2={y}
              stroke="rgba(167,139,250,0.12)"
              strokeWidth="0.5"
            />
          ))}
          <path d={area} fill="url(#overviewFill)" opacity="0.55" />
          <path
            d={path}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {POINTS.filter((_, i) => i % 2 === 0).map((p) => (
            <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="2.2" fill="#c084fc" />
          ))}
          <defs>
            <linearGradient id="overviewFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7b2cff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#7b2cff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute top-[28%] left-[42%] rounded-xl border border-border bg-bg-deep/95 px-3 py-2 shadow-lg backdrop-blur">
          <p className="text-[10px] text-muted-2">May 17, 2024</p>
          <p className="text-sm font-semibold text-white">$210,430.00</p>
        </div>
      </div>
    </section>
  );
}
