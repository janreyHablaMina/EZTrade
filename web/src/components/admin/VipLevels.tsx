const LEVELS = [
  { label: "VIP 1", users: 5230, pct: 42 },
  { label: "VIP 2", users: 3180, pct: 26 },
  { label: "VIP 3", users: 2140, pct: 17 },
  { label: "VIP 4", users: 1180, pct: 10 },
  { label: "VIP 5", users: 634, pct: 5 },
];

export function VipLevels() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">Users by VIP Level</h3>
      <div className="flex flex-1 flex-col justify-center space-y-3.5">
        {LEVELS.map((level) => (
          <div key={level.label}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-white">{level.label}</span>
              <span className="text-muted-2">
                {level.users.toLocaleString()} · {level.pct}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bg-deep">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple to-purple-bright"
                style={{ width: `${level.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
