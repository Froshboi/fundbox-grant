import { useState } from "react";
import { GRANTS } from "@/data/grants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Pencil } from "lucide-react";

export default function AdminGrants() {
  const [q, setQ] = useState("");
  const list = GRANTS.filter(g => !q || (g.title + g.provider).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="h3">Grant Management</h1><p className="muted text-sm">Manage {GRANTS.length} active programs.</p></div>
        <div className="flex gap-2">
          <input className="input max-w-xs" placeholder="Search grants..." value={q} onChange={e => setQ(e.target.value)} />
          <button className="btn-primary">+ New grant</button>
        </div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead className="bg-ink-50 dark:bg-ink-900 text-xs uppercase muted">
            <tr><th className="text-left p-3">Program</th><th className="text-left p-3">Provider</th><th className="text-left p-3">Category</th><th className="text-left p-3">Range</th><th className="text-left p-3">Deadline</th><th className="text-left p-3">Status</th><th className="text-left p-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {list.map(g => (
              <tr key={g.id}>
                <td className="p-3"><div className="font-medium">{g.title}</div><div className="text-xs muted">{g.id}</div></td>
                <td className="p-3 text-xs">{g.provider}</td>
                <td className="p-3"><span className="chip bg-ink-100 dark:bg-ink-800 text-xs">{g.category}</span></td>
                <td className="p-3 text-xs">{formatCurrency(g.fundingRangeLow)}–{formatCurrency(g.fundingRangeHigh)}</td>
                <td className="p-3 text-xs">{formatDate(g.deadline)}</td>
                <td className="p-3 text-xs">{g.status}</td>
                <td className="p-3 text-right"><button className="btn-ghost p-2"><Pencil className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
