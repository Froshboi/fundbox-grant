import { useState } from "react";

interface Applicant { id: string; name: string; org: string; email: string; state: string; industry: string; apps: number; status: "Active" | "Suspended" | "Pending KYC" }

const seed: Applicant[] = [
  { id: "u-01001", name: "Jamie Rivera", org: "Rivera Robotics LLC", email: "jamie@riverarobotics.com", state: "TX", industry: "Technology", apps: 5, status: "Active" },
  { id: "u-01002", name: "Ayana Brooks", org: "The Rooted Kitchen", email: "ayana@rootedkitchen.com", state: "MI", industry: "Food & Beverage", apps: 3, status: "Active" },
  { id: "u-01003", name: "Marcus Reyes", org: "Sundial Learning", email: "marcus@sundiallearning.org", state: "CA", industry: "Education", apps: 4, status: "Active" },
  { id: "u-01004", name: "Elena Vasquez", org: "Meridian Robotics", email: "elena@meridianrobotics.com", state: "TX", industry: "Technology", apps: 7, status: "Active" },
  { id: "u-01005", name: "David Klein", org: "Overwatch Logistics", email: "david@overwatchlogistics.com", state: "VA", industry: "Logistics", apps: 6, status: "Active" },
  { id: "u-01006", name: "Naomi Whitehorse", org: "Prairie Community Health", email: "naomi@prairiehealth.org", state: "SD", industry: "Healthcare", apps: 2, status: "Pending KYC" },
  { id: "u-01007", name: "Julian Park", org: "Cascade Solar Co-op", email: "julian@cascadesolar.coop", state: "OR", industry: "Clean Energy", apps: 5, status: "Active" },
  { id: "u-01008", name: "Priya Menon", org: "Nightingale Biosciences", email: "priya@nightingalebio.com", state: "MA", industry: "Healthcare", apps: 3, status: "Suspended" },
];

export default function AdminApplicants() {
  const [q, setQ] = useState("");
  const list = seed.filter(a => !q || (a.name + a.org + a.email).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="h3">Applicant Management</h1><p className="muted text-sm">{seed.length} total applicants across US states.</p></div>
        <input className="input max-w-xs" placeholder="Search name, org, email..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-ink-50 dark:bg-ink-900 text-xs uppercase muted">
            <tr><th className="text-left p-3">Applicant</th><th className="text-left p-3">Email</th><th className="text-left p-3">State</th><th className="text-left p-3">Industry</th><th className="text-left p-3">Apps</th><th className="text-left p-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {list.map(a => (
              <tr key={a.id}>
                <td className="p-3"><div className="font-medium">{a.name}</div><div className="text-xs muted">{a.org} · {a.id}</div></td>
                <td className="p-3 text-xs">{a.email}</td>
                <td className="p-3 text-xs">{a.state}</td>
                <td className="p-3 text-xs">{a.industry}</td>
                <td className="p-3 text-xs">{a.apps}</td>
                <td className="p-3"><span className={"chip " + (a.status === "Active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300" : a.status === "Suspended" ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300" : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300")}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
