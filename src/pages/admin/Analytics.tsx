import { GRANTS } from "@/data/grants";
import { STORIES } from "@/data/stories";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, DollarSign, FileCheck, TrendingUp, Users } from "lucide-react";

const kpis = [
  { label: "Total Applicants", value: "12,483", delta: "+8.2% MoM", icon: Users },
  { label: "Applications This Month", value: "1,247", delta: "+14.6% MoM", icon: FileCheck },
  { label: "Funding Facilitated", value: "$125.4M", delta: "+$4.1M MoM", icon: DollarSign },
  { label: "Approval Rate", value: "23.4%", delta: "+1.2 pts MoM", icon: TrendingUp },
];

const monthly = [
  { m: "Jan", apps: 620, approved: 138 }, { m: "Feb", apps: 715, approved: 152 },
  { m: "Mar", apps: 840, approved: 191 }, { m: "Apr", apps: 892, approved: 208 },
  { m: "May", apps: 1010, approved: 231 }, { m: "Jun", apps: 1088, approved: 249 },
  { m: "Jul", apps: 1147, approved: 262 }, { m: "Aug", apps: 1203, approved: 281 },
  { m: "Sep", apps: 1247, approved: 292 },
];
const maxApps = Math.max(...monthly.map(m => m.apps));

export default function AdminAnalytics() {
  const catCounts = GRANTS.reduce<Record<string, number>>((acc, g) => { acc[g.category] = (acc[g.category] || 0) + 1; return acc; }, {});
  const cats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const catMax = Math.max(...cats.map(c => c[1]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h3">Admin Analytics</h1>
        <p className="muted text-sm">Platform-wide performance across grants, applicants, and awards.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="card p-5">
            <div className="flex items-center justify-between"><k.icon className="h-4 w-4 text-brand-600" /><ArrowUpRight className="h-4 w-4 text-emerald-600" /></div>
            <div className="font-display text-2xl font-bold mt-3">{k.value}</div>
            <div className="text-xs muted">{k.label}</div>
            <div className="text-xs text-emerald-600 mt-1">{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <div className="font-semibold">Applications vs Approvals (last 9 months)</div>
          <div className="mt-4 flex items-end gap-2 h-48">
            {monthly.map(m => (
              <div key={m.m} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end h-full">
                  <div className="flex-1 bg-brand-500 rounded-t" style={{ height: (m.apps / maxApps) * 100 + "%" }} title={`${m.apps} apps`} />
                  <div className="flex-1 bg-brand-200 dark:bg-brand-800 rounded-t" style={{ height: (m.approved / maxApps) * 100 + "%" }} title={`${m.approved} approved`} />
                </div>
                <div className="text-[10px] muted">{m.m}</div>
              </div>
            ))}
          </div>
          <div className="text-xs muted mt-2 flex gap-4"><span><span className="inline-block h-2 w-2 bg-brand-500 mr-1 rounded" /> Applications</span><span><span className="inline-block h-2 w-2 bg-brand-200 dark:bg-brand-800 mr-1 rounded" /> Approvals</span></div>
        </div>

        <div className="card p-5">
          <div className="font-semibold">Grants by category</div>
          <div className="mt-4 space-y-2">
            {cats.map(([c, n]) => (
              <div key={c}>
                <div className="flex justify-between text-xs"><span>{c}</span><span className="muted">{n}</span></div>
                <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden"><div className="h-full bg-brand-500" style={{ width: (n / catMax) * 100 + "%" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="font-semibold mb-3">Recent notable awards</div>
        <div className="divide-y divide-ink-100 dark:divide-ink-800">
          {STORIES.map(s => (
            <div key={s.id} className="py-3 flex flex-wrap items-center gap-3 justify-between">
              <div>
                <div className="font-medium text-sm">{s.organization}</div>
                <div className="text-xs muted">{s.grantAwarded} · {s.location}</div>
              </div>
              <div className="font-semibold text-brand-600">{formatCurrency(s.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
