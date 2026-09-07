import { useState, type FormEvent } from "react";
import { useApplications } from "@/contexts/ApplicationContext";

export default function Applications() {
  const { apps, add } = useApplications();
  const [submitted, setSubmitted] = useState(false);
  async function submit(form: FormEvent<HTMLFormElement>) {
    form.preventDefault();
    const data = new FormData(form.currentTarget);
    await add({
      grantId: "funding-request",
      grantTitle: String(data.get("title")),
      status: "Submitted",
      submittedAt: new Date().toISOString(),
      amountRequested: Number(data.get("amount")),
      notes: String(data.get("notes") || ""),
    });
    form.currentTarget.reset();
    setSubmitted(true);
  }
  return (
    <div className="space-y-4">
      <div>
        <h1 className="h3">Applications</h1>
        <p className="muted text-sm">Track every application from draft to award.</p>
      </div>
      <div className="card p-5">
        <h2 className="font-semibold">Request funding</h2>
        <p className="muted text-sm mt-1">Submit your funding request for review by the Get Funded Grants team.</p>
        <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
          <div><label className="label">Request title</label><input required name="title" className="input" placeholder="What are you funding?" /></div>
          <div><label className="label">Amount requested</label><input required min="1" type="number" name="amount" className="input" /></div>
          <div className="md:col-span-2"><label className="label">Details</label><textarea required name="notes" className="input min-h-28" placeholder="Explain your project, timeline, and intended use of funds." /></div>
          <button className="btn-primary w-fit">Submit request</button>
          {submitted && <div className="text-sm text-emerald-600 self-center">Request submitted for review.</div>}
        </form>
      </div>
      <div className="space-y-3">
        {apps.map(app => <div key={app.id} className="card p-4 flex justify-between gap-4"><div><div className="font-medium">{app.grantTitle}</div><div className="text-sm muted">{app.notes}</div></div><span className="chip bg-ink-100 dark:bg-ink-800">{app.status}</span></div>)}
      </div>
    </div>
  );
}
