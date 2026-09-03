import { useApplications } from "@/contexts/ApplicationContext";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminReviews() {
  const { apps, update } = useApplications();
  const queue = apps.filter(a => a.status === "Submitted" || a.status === "In Review" || a.status === "Additional Information Required");
  return (
    <div className="space-y-4">
      <div><h1 className="h3">Application Review Queue</h1><p className="muted text-sm">{queue.length} applications awaiting review action.</p></div>
      <div className="space-y-3">
        {queue.map(a => (
          <div key={a.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{a.grantTitle}</div>
                <div className="text-xs muted">{a.id} · submitted {a.submittedAt ? formatDate(a.submittedAt) : "—"}</div>
                <div className="text-sm mt-2">Requested: <b>{formatCurrency(a.amountRequested)}</b></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => update(a.id, { status: "In Review" })} className="btn-outline text-xs">Move to review</button>
                <button onClick={() => update(a.id, { status: "Additional Information Required", notes: "Please provide updated financial statements." })} className="btn-outline text-xs">Request info</button>
                <button onClick={() => update(a.id, { status: "Approved" })} className="btn-primary text-xs">Approve</button>
                <button onClick={() => update(a.id, { status: "Declined" })} className="btn text-xs bg-red-600 text-white hover:bg-red-700">Decline</button>
              </div>
            </div>
          </div>
        ))}
        {queue.length === 0 && <div className="card p-10 text-center muted text-sm">Review queue is clear.</div>}
      </div>
    </div>
  );
}
