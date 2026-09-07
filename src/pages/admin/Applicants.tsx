import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Applicant { id: string; name: string; organization: string; created_at: string }

export default function AdminApplicants() {
  const [q, setQ] = useState("");
  const [list, setList] = useState<Applicant[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!supabase) return;
    supabase.from("profiles").select("id,name,organization,created_at").order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => queryError ? setError(queryError.message) : setList(data ?? []));
  }, []);
  const filtered = useMemo(() => list.filter(a => `${a.name} ${a.organization}`.toLowerCase().includes(q.toLowerCase())), [list, q]);
  async function notify(userId: string) {
    if (!supabase || !message.trim()) return;
    const { error: notifyError } = await supabase.rpc("admin_send_notification", {
      target_user: userId, notification_title: "Message from Get Funded Grants", notification_body: message.trim(),
    });
    if (notifyError) setError(notifyError.message);
    else setMessage("");
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="h3">Applicant Management</h1><p className="muted text-sm">{list.length} registered accounts.</p></div>
        <input className="input max-w-xs" placeholder="Search name or organization..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="card p-4 flex gap-2"><input className="input" value={message} onChange={e => setMessage(e.target.value)} placeholder="Notification message for a selected user" /><span className="text-xs muted self-center">Choose Send below</span></div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]"><thead className="bg-ink-50 dark:bg-ink-900 text-xs uppercase muted"><tr><th className="text-left p-3">Applicant</th><th className="text-left p-3">Joined</th><th className="text-left p-3">Action</th></tr></thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">{filtered.map(applicant => <tr key={applicant.id}><td className="p-3"><div className="font-medium">{applicant.name || "Unnamed applicant"}</div><div className="text-xs muted">{applicant.organization || "No organization provided"}</div></td><td className="p-3 text-xs">{new Date(applicant.created_at).toLocaleDateString()}</td><td className="p-3"><button className="btn-outline py-1.5" onClick={() => void notify(applicant.id)}>Send notification</button></td></tr>)}</tbody>
        </table>
        {filtered.length === 0 && <div className="p-5 text-sm muted">No registered accounts match your search.</div>}
      </div>
    </div>
  );
}
