import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Withdrawal { id: string; user_id: string; amount: number; status: string; payout_account_last4: string | null; payout_cash_tag: string | null; created_at: string }
export default function AdminFunding() {
  const [userId, setUserId] = useState("");
  const [adjustment, setAdjustment] = useState("");
  const [memo, setMemo] = useState("");
  const [requests, setRequests] = useState<Withdrawal[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => { if (supabase) void load(); }, []);
  async function load() {   if (!supabase) return;
  const { data } = await supabase.from("withdrawal_requests").select("*").order("created_at", { ascending: false });
  setRequests(data ?? []); }
  async function adjust(e: FormEvent) {
    e.preventDefault(); setMessage(null); if (!supabase) return;
    const value = Number(adjustment);
    const { error } = await supabase.rpc("admin_adjust_balance", { target_user: userId, adjustment: value, transaction_memo: memo });
    if (error) setMessage(error.message); else { setMessage("Balance updated."); setAdjustment(""); setMemo(""); }
  }
  async function review(id: string, decision: "Approved" | "Rejected") {
    if (!supabase) return;
    const { error } = await supabase.rpc("admin_review_withdrawal", { request_id: id, decision });
    if (error) setMessage(error.message); else void load();
  }
  return <div className="space-y-6">
    <div><h1 className="h3">Funding Administration</h1><p className="muted text-sm">Credit or debit a user wallet and review payout requests.</p></div>
    <form onSubmit={adjust} className="card p-5 grid gap-4 md:grid-cols-4">
      <input className="input" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} required />
      <input className="input" type="number" step="0.01" placeholder="+500 or -100" value={adjustment} onChange={e => setAdjustment(e.target.value)} required />
      <input className="input" placeholder="Transaction memo" value={memo} onChange={e => setMemo(e.target.value)} required />
      <button className="btn-primary">Update balance</button>
      {message && <div className="text-sm muted md:col-span-4">{message}</div>}
    </form>
    <div className="card overflow-x-auto"><table className="w-full text-sm min-w-[700px]"><thead className="bg-ink-50 dark:bg-ink-900 text-xs uppercase muted"><tr><th className="text-left p-3">User</th><th className="text-left p-3">Amount</th><th className="text-left p-3">Payout account</th><th className="text-left p-3">Created</th><th className="text-left p-3">Action</th></tr></thead><tbody className="divide-y divide-ink-100 dark:divide-ink-800">{requests.map(request => <tr key={request.id}><td className="p-3 font-mono text-xs">{request.user_id}</td><td className="p-3">{formatCurrency(request.amount)}</td><td className="p-3">{request.payout_cash_tag ?? `••••${request.payout_account_last4 ?? ""}`}</td><td className="p-3 text-xs muted">{formatDate(request.created_at)}</td><td className="p-3">{request.status === "Pending" ? <div className="flex gap-2"><button className="btn-primary py-1" onClick={() => void review(request.id, "Approved")}>Approve</button><button className="btn-outline py-1" onClick={() => void review(request.id, "Rejected")}>Reject</button></div> : <span className="chip bg-ink-100 dark:bg-ink-800">{request.status}</span>}</td></tr>)}</tbody></table></div>
  </div>;
}
