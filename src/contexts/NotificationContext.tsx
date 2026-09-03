import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Notif {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: "application" | "match" | "deadline" | "system";
}

const seed: Notif[] = [
  { id: "n1", title: "New match: 92% for SBIR Phase I", body: "Your organization strongly matches the NSF SBIR Phase I opportunity.", createdAt: new Date(Date.now() - 3600e3).toISOString(), read: false, type: "match" },
  { id: "n2", title: "Application status: In Review", body: "Your Women-Owned Business Expansion Grant application has entered review.", createdAt: new Date(Date.now() - 86400e3).toISOString(), read: false, type: "application" },
  { id: "n3", title: "Deadline reminder", body: "SBA Growth Accelerator Grant closes in 5 days.", createdAt: new Date(Date.now() - 2 * 86400e3).toISOString(), read: true, type: "deadline" },
  { id: "n4", title: "Welcome to Fundbox Grants", body: "Your account has been created. Complete your profile to unlock AI matching.", createdAt: new Date(Date.now() - 7 * 86400e3).toISOString(), read: true, type: "system" },
];

interface Ctx { items: Notif[]; unread: number; markAllRead: () => void; markRead: (id: string) => void; push: (n: Omit<Notif, "id" | "createdAt" | "read">) => void }
const C = createContext<Ctx | null>(null);
const KEY = "fb-notifs";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Notif[]>(() => {
    if (typeof window === "undefined") return seed;
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seed;
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  return <C.Provider value={{
    items,
    unread: items.filter(i => !i.read).length,
    markAllRead: () => setItems(items.map(i => ({ ...i, read: true }))),
    markRead: (id) => setItems(items.map(i => i.id === id ? { ...i, read: true } : i)),
    push: (n) => setItems(prev => [{ ...n, id: "n" + Math.random().toString(36).slice(2, 7), createdAt: new Date().toISOString(), read: false }, ...prev]),
  }}>{children}</C.Provider>;
}
export const useNotifications = () => useContext(C)!;
