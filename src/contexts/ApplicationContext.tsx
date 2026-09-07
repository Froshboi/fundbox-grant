import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export type AppStatus = "Draft" | "Submitted" | "In Review" | "Additional Information Required" | "Approved" | "Declined";

export interface Application {
  id: string;
  grantId: string;
  grantTitle: string;
  status: AppStatus;
  submittedAt: string | null;
  updatedAt: string;
  amountRequested: number;
  notes?: string;
}

interface Ctx {
  apps: Application[];
  update: (id: string, patch: Partial<Application>) => Promise<void>;
  add: (a: Omit<Application, "id" | "updatedAt">) => Promise<void>;
}
const C = createContext<Ctx | null>(null);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  useEffect(() => {
    if (!supabase || !user) { setApps([]); return; }
    supabase.from("applications").select("*").eq("user_id", user.id).order("updated_at", { ascending: false })
      .then(({ data }) => setApps((data ?? []).map(row => ({
        id: row.id, grantId: row.grant_id, grantTitle: row.grant_title, status: row.status,
        submittedAt: row.submitted_at, updatedAt: row.updated_at, amountRequested: row.amount_requested, notes: row.notes,
      }))));
  }, [user]);
  return <C.Provider value={{
    apps,
    update: async (id: string, patch: Partial<Application>) => {
      if (!supabase || !user) return;
      const { error } = await supabase.from("applications").update({
        status: patch.status, notes: patch.notes, amount_requested: patch.amountRequested,
        submitted_at: patch.submittedAt, updated_at: new Date().toISOString(),
      }).eq("id", id).eq("user_id", user.id);
      if (error) throw error;
      setApps(current => current.map(x => x.id === id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x));
    },
    add: async (a: Omit<Application, "id" | "updatedAt">) => {
      if (!supabase || !user) return;
      const { data, error } = await supabase.from("applications").insert({
        user_id: user.id, grant_id: a.grantId, grant_title: a.grantTitle, status: a.status,
        submitted_at: a.submittedAt, amount_requested: a.amountRequested, notes: a.notes,
      }).select().single();
      if (error) throw error;
      if (data) setApps(prev => [{ ...a, id: data.id, updatedAt: data.updated_at }, ...prev]);
    },
  }}>{children}</C.Provider>;
}

export function useApplications(): Ctx {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useApplications must be used within ApplicationProvider");
  return ctx;
}
