import { useState } from "react";
import { useApplications, type AppStatus } from "@/contexts/ApplicationContext";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const statuses: (AppStatus | "All")[] = ["All", "Draft", "Submitted", "In Review", "Additional Information Required", "Approved", "Declined"];

const statusStyle: Record<AppStatus, string> = {
  Draft: "bg-ink-100 text-ink-800 dark:bg-ink-800 dark:text-ink-200",
  Submitted: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
  "In Review": "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  "Additional Information Required": "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
  Approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  Declined: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
};

export default function Applications() {
  const { apps, update } = useApplications();
  const [filter, setFilter] = useState<AppStatus | "All">("All");
  const list = apps.filter(a => filter === "All" || a.status === filter);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="h3">Applications</h1>
        <p className="muted text-sm">Track every application from draft to award.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn("chip px-3 py-1.5", filter === s ? "bg-brand-600 text-white" : "bg-ink-100 dark:bg-ink-800")}>
            {s} <span className="ml-1 muted text-[10px]">{s === "All" ? apps.length : apps.filter(a => a.status === s).length}</span>
          </button>
        ))}
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 dark:bg-ink-900 text-xs uppercase muted">
            <tr>
              <th className="text-left p-3">Application</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Last update</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {list.map(a => (
              <tr key={a.id}>
                <td className="p-3">
                  <div className="font-medium">{a.grantTitle}</div>
                  <div className="text-xs muted">{a.id} · {a.submittedAt ? "Submitted " + formatDate(a.submittedAt) : "Not submitted"}</div>
                  {a.notes && <div className="text-xs mt-1 p-2 rounded bg-orange-50 dark:bg-orange-500/10 text-orange-800 dark:text-orange-300">Note from reviewer: {a.notes}</div>}
                </td>
                <td className="p-3 font-medium">{formatCurrency(a.amountRequested)}</td>
                <td className="p-3"><span className={"chip " + statusStyle[a.status]}>{a.status}</span></td>
                <td className="p-3 text-xs muted">{formatDate(a.updatedAt)}</td>
                <td className="p-3">
                  <select value={a.status} onChange={e => update(a.id, { status: e.target.value as AppStatus })} className="input py-1 text-xs w-auto">
                    {(["Draft","Submitted","In Review","Additional Information Required","Approved","Declined"] as AppStatus[]).map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="p-8 text-center muted text-sm">No applications with this status.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
