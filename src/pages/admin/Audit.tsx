const logs = [
  { t: "2m ago", who: "admin@fundboxgrants.com", action: "Approved application app-005 (Amber Grant for Women)", ip: "10.4.19.22" },
  { t: "17m ago", who: "reviewer1@fundboxgrants.com", action: "Moved app-001 to In Review", ip: "10.4.19.31" },
  { t: "1h ago", who: "admin@fundboxgrants.com", action: "Created grant program 'Small Manufacturer Modernization Grant'", ip: "10.4.19.22" },
  { t: "3h ago", who: "system", action: "Nightly AI matching batch completed (12,483 profiles)", ip: "internal" },
  { t: "5h ago", who: "compliance@fundboxgrants.com", action: "Verified VOSB certification for Overwatch Logistics", ip: "10.4.19.44" },
  { t: "yesterday", who: "admin@fundboxgrants.com", action: "Published article 'DOE Announces $2.5B for Small Manufacturer Emissions Reduction'", ip: "10.4.19.22" },
  { t: "yesterday", who: "system", action: "Sent 4,218 deadline reminder emails", ip: "internal" },
  { t: "2 days ago", who: "admin@fundboxgrants.com", action: "Suspended applicant u-01008 pending compliance review", ip: "10.4.19.22" },
];

export default function AdminAudit() {
  return (
    <div className="space-y-4">
      <h1 className="h3">Audit Logs</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 dark:bg-ink-900 text-xs uppercase muted"><tr><th className="text-left p-3">When</th><th className="text-left p-3">Actor</th><th className="text-left p-3">Action</th><th className="text-left p-3">IP</th></tr></thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {logs.map((l, i) => (
              <tr key={i}><td className="p-3 text-xs whitespace-nowrap">{l.t}</td><td className="p-3 text-xs">{l.who}</td><td className="p-3 text-sm">{l.action}</td><td className="p-3 text-xs muted">{l.ip}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
