import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Transaction { id: string; amount: number; kind: string; memo: string; created_at: string }
interface Withdrawal { id: string; amount: number; status: string; payout_account_last4: string; created_at: string }

export default function Funding() {
  const { user, profileCompletion } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [last4, setLast4] = useState("");
  const [bankName, setBankName] = useState("");
  const [cashTag, setCashTag] = useState("");
  const [method, setMethod] = useState<"bank" | "cashapp">("bank");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !user) return;
    Promise.all([
      supabase.from("wallets").select("balance").eq("user_id", user.id).maybeSingle(),
      supabase.from("wallet_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("withdrawal_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("payout_accounts").select("bank_name,account_last4,cash_tag").eq("user_id", user.id).maybeSingle(),
    ]).then(([wallet, tx, requests, payout]) => {
      setBalance(Number(wallet.data?.balance ?? 0));
      setTransactions(tx.data ?? []);
      setWithdrawals(requests.data ?? []);
      if (payout.data) {
        setBankName(payout.data.bank_name ?? "");
        setLast4(payout.data.account_last4 ?? "");
        setCashTag(payout.data.cash_tag ?? "");
        if (payout.data.cash_tag) setMethod("cashapp");
      }
    });
  }, [user]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!supabase || !user) return;
    if (profileCompletion < 100) { setMessage("Complete your organization profile before requesting funding."); return; }
    const normalizedCashTag = cashTag.trim().replace(/^\$/, "");
    if (method === "bank" && !/^\d{4}$/.test(last4)) { setMessage("Enter the last four digits of the payout account."); return; }
    if (method === "cashapp" && !/^[A-Za-z0-9][A-Za-z0-9._-]{0,19}$/.test(normalizedCashTag)) { setMessage("Enter a valid Cash App $cashtag (up to 20 characters)."); return; }
    const value = Number(amount);
    if (!value || value <= 0 || value > balance) { setMessage("Enter an amount no greater than your available balance."); return; }
    const payout = await supabase.from("payout_accounts").upsert({
      user_id: user.id,
      bank_name: method === "bank" ? bankName : "Cash App",
      account_last4: method === "bank" ? last4 : null,
      cash_tag: method === "cashapp" ? `$${normalizedCashTag}` : null,
      status: "Pending",
    });
    if (payout.error) { setMessage(payout.error.message); return; }
    const request = await supabase.from("withdrawal_requests").insert({
      user_id: user.id,
      amount: value,
      payout_account_last4: method === "bank" ? last4 : null,
      payout_cash_tag: method === "cashapp" ? `$${normalizedCashTag}` : null,
    }).select().single();
    if (request.error) { setMessage(request.error.message); return; }
    setWithdrawals(current => [request.data, ...current]);
    setAmount("");
    setMessage("Withdrawal request submitted for administrator approval.");
  }

  return <div className="space-y-6">
    <div><h1 className="h3">Funding</h1><p className="muted text-sm">View awarded funds and request a payout.</p></div>
    <div className="card p-6"><div className="text-sm muted">Available balance</div><div className="font-display text-4xl font-bold mt-1">{formatCurrency(balance)}</div></div>
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={submit} className="card p-5 space-y-4">
        <div><div className="font-semibold">Request a withdrawal</div><p className="text-sm muted mt-1">Your profile must be complete. An administrator reviews every request.</p></div>
        <div><label className="label">Payout method</label><select className="input" value={method} onChange={e => setMethod(e.target.value as "bank" | "cashapp")}><option value="bank">Bank account</option><option value="cashapp">Cash App</option></select></div>
        {method === "bank" ? <><div><label className="label">Bank or payout provider</label><input className="input" value={bankName} onChange={e => setBankName(e.target.value)} required /></div><div><label className="label">Account last four digits</label><input className="input" inputMode="numeric" maxLength={4} value={last4} onChange={e => setLast4(e.target.value.replace(/\D/g, ""))} required /></div></> : <div><label className="label">Cash App $cashtag</label><input className="input" placeholder="$YourCashtag" value={cashTag} onChange={e => setCashTag(e.target.value)} required /><p className="text-xs muted mt-1">We store the cashtag for manual Cash App payout processing.</p></div>}
        <div><label className="label">Amount</label><input className="input" type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required /></div>
        {message && <div className="text-sm muted">{message}</div>}
        <button className="btn-primary w-full" disabled={profileCompletion < 100}>Request withdrawal</button>
      </form>
      <div className="card p-5"><div className="font-semibold">Withdrawal requests</div><div className="mt-3 divide-y divide-ink-100 dark:divide-ink-800">{withdrawals.map(item => <div key={item.id} className="py-3 flex justify-between text-sm"><span>{formatCurrency(item.amount)} · {item.payout_account_last4 ? `account ending ${item.payout_account_last4}` : "Cash App payout"}</span><span className="chip bg-ink-100 dark:bg-ink-800">{item.status}</span></div>)}{withdrawals.length === 0 && <div className="py-6 text-sm muted">No withdrawal requests.</div>}</div></div>
    </div>
    <div className="card p-5"><div className="font-semibold">Funding history</div><div className="mt-3 divide-y divide-ink-100 dark:divide-ink-800">{transactions.map(item => <div key={item.id} className="py-3 flex justify-between text-sm"><span>{item.memo}<span className="block text-xs muted">{formatDate(item.created_at)}</span></span><span className={item.amount > 0 ? "text-emerald-600" : "text-red-600"}>{item.amount > 0 ? "+" : ""}{formatCurrency(item.amount)}</span></div>)}{transactions.length === 0 && <div className="py-6 text-sm muted">No funding activity yet.</div>}</div></div>
  </div>;
}
