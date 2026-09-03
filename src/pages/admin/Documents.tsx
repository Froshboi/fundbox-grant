import { FileText } from "lucide-react";

const docs = [
  { id: "1", org: "Rivera Robotics LLC", name: "articles_of_incorp.pdf", type: "Articles", size: "482 KB", verified: true },
  { id: "2", org: "Rivera Robotics LLC", name: "ein_letter.pdf", type: "EIN", size: "112 KB", verified: true },
  { id: "3", org: "The Rooted Kitchen", name: "fy2024_financials.xlsx", type: "Financials", size: "1.2 MB", verified: false },
  { id: "4", org: "Meridian Robotics", name: "business_plan.pdf", type: "Business Plan", size: "3.4 MB", verified: true },
  { id: "5", org: "Overwatch Logistics", name: "vosb_cert.pdf", type: "Certification", size: "220 KB", verified: true },
];

export default function AdminDocuments() {
  return (
    <div className="space-y-4">
      <h1 className="h3">Document Management</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-ink-50 dark:bg-ink-900 text-xs uppercase muted"><tr><th className="text-left p-3">File</th><th className="text-left p-3">Organization</th><th className="text-left p-3">Type</th><th className="text-left p-3">Size</th><th className="text-left p-3">Verification</th></tr></thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {docs.map(d => (
              <tr key={d.id}>
                <td className="p-3 flex items-center gap-2"><FileText className="h-4 w-4 text-brand-600" />{d.name}</td>
                <td className="p-3 text-xs">{d.org}</td>
                <td className="p-3 text-xs">{d.type}</td>
                <td className="p-3 text-xs">{d.size}</td>
                <td className="p-3"><span className={"chip " + (d.verified ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300")}>{d.verified ? "Verified" : "Pending"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
