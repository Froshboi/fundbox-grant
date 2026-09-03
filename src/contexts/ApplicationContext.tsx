import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

const KEY = "fb-apps";
const seed: Application[] = [
  { id: "app-001", grantId: "grant-002", grantTitle: "Women-Owned Business Expansion Grant", status: "In Review", submittedAt: new Date(Date.now() - 8 * 86400e3).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400e3).toISOString(), amountRequested: 25000 },
  { id: "app-002", grantId: "grant-006", grantTitle: "Technology Innovation Grant (SBIR Phase I)", status: "Draft", submittedAt: null, updatedAt: new Date(Date.now() - 1 * 86400e3).toISOString(), amountRequested: 275000 },
  { id: "app-003", grantId: "grant-001", grantTitle: "SBA Growth Accelerator Grant", status: "Submitted", submittedAt: new Date(Date.now() - 3 * 86400e3).toISOString(), updatedAt: new Date(Date.now() - 3 * 86400e3).toISOString(), amountRequested: 50000 },
  { id: "app-004", grantId: "grant-008", grantTitle: "Nonprofit Capacity Building Grant", status: "Additional Information Required", submittedAt: new Date(Date.now() - 20 * 86400e3).toISOString(), updatedAt: new Date(Date.now() - 4 * 86400e3).toISOString(), amountRequested: 150000, notes: "Please provide updated board roster and FY2024 audited financials." },
  { id: "app-005", grantId: "grant-011", grantTitle: "Amber Grant for Women", status: "Approved", submittedAt: new Date(Date.now() - 60 * 86400e3).toISOString(), updatedAt: new Date(Date.now() - 5 * 86400e3).toISOString(), amountRequested: 10000 },
];

interface Ctx {
  apps: Application[];
  update: (id: string, patch: Partial<Application>) => void;
  add: (a: Omit<Application, "id" | "updatedAt">) => void;
}
const C = createContext<Ctx | null>(null);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<Application[]>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    return raw ? JSON.parse(raw) : seed;
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(apps)); }, [apps]);
  return <C.Provider value={{
    apps,
    update: (id: string, patch: Partial<Application>) =>
      setApps(a => a.map(x => x.id === id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x)),
    add: (a: Omit<Application, "id" | "updatedAt">) =>
      setApps(prev => [{ ...a, id: "app-" + Math.random().toString(36).slice(2, 6), updatedAt: new Date().toISOString() }, ...prev]),
  }}>{children}</C.Provider>;
}

export function useApplications(): Ctx {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useApplications must be used within ApplicationProvider");
  return ctx;
}
