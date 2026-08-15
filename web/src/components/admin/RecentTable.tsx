type RowStatus = "Completed" | "Pending" | "Failed" | "Rejected";

type TableRow = {
  title: string;
  rows: {
    name: string;
    id: string;
    amount: string;
    network: string;
    txid: string;
    status: RowStatus;
    date: string;
  }[];
};

const statusStyles: Record<RowStatus, string> = {
  Completed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Failed: "bg-danger/15 text-danger",
  Rejected: "bg-danger/15 text-danger",
};

export function RecentTable({ title, rows }: TableProps) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <button type="button" className="text-xs font-medium text-purple-bright hover:underline">
          View All
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Network</th>
              <th className="pb-3 font-medium">TXID</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.id}-${row.txid}`} className="border-b border-border/60 last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/25 text-[10px] font-semibold text-purple-bright">
                      {row.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{row.name}</p>
                      <p className="text-[10px] text-muted-2">{row.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 font-medium text-white">{row.amount}</td>
                <td className="py-3 text-muted">{row.network}</td>
                <td className="py-3 font-mono text-[11px] text-muted">{row.txid}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-3 text-muted-2">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
