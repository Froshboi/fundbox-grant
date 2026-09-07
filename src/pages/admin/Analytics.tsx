import { useEffect, useState } from "react";
import { FileCheck, Users, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ users: 0, applications: 0, approved: 0, balance: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("applications").select("id", { count: "exact", head: true }),
      supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "Approved"),
      supabase.from("wallets").select("balance"),
    ]).then(([users, applications, approved, wallets]) => {
      const firstError = users.error ?? applications.error ?? approved.error ?? wallets.error;
      if (firstError) { setError(firstError.message); return; }
      setStats({
        users: users.count ?? 0,
        applications: applications.count ?? 0,
        approved: approved.count ?? 0,
        balance: (wallets.data ?? []).reduce((sum, wallet) => sum + Number(wallet.balance ?? 0), 0),
      });
    });
  }, []);

  const cards = [
    { label: "Registered accounts", value: stats.users, icon: Users },
    { label: "Funding requests", value: stats.applications, icon: FileCheck },
    { label: "Approved requests", value: stats.approved, icon: FileCheck },
    { label: "Wallet balance", value: `$${stats.balance.toLocaleString()}`, icon: Wallet },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="h3">Admin Analytics</h1><p className="muted text-sm">Live platform totals from Supabase.</p></div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map(card => <div key={card.label} className="card p-5"><card.icon className="h-4 w-4 text-brand-600" /><div className="font-display text-2xl font-bold mt-3">{card.value}</div><div className="text-xs muted">{card.label}</div></div>)}
      </div>
      <div className="card p-5 text-sm muted">Use Applicant Management to review real accounts and Support Inbox to respond to customer issues.</div>
    </div>
  );
}
