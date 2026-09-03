import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

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
  const { user } = useAuth();
  const storageKey = `${KEY}-${user?.id ?? "anonymous"}`;
  const [items, setItems] = useState<Notif[]>(() => {
    if (typeof window === "undefined") return seed;
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  });
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    setItems(raw ? JSON.parse(raw) : []);
    if (!supabase || !user) return;
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => { if (data) setItems(data.map(n => ({ id: n.id, title: n.title, body: n.body, createdAt: n.created_at, read: n.read, type: n.type }))); });
    const channel = supabase.channel(`notifications-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        payload => setItems(current => [{ id: payload.new.id, title: payload.new.title, body: payload.new.body, createdAt: payload.new.created_at, read: payload.new.read, type: payload.new.type }, ...current]))
      .subscribe();
    return () => { void supabase?.removeChannel(channel); };
  }, [user, storageKey]);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items)); }, [items, storageKey]);

  return <C.Provider value={{
    items,
    unread: items.filter(i => !i.read).length,
    markAllRead: () => { setItems(current => current.map(i => ({ ...i, read: true }))); if (supabase && user) void supabase.from("notifications").update({ read: true }).eq("user_id", user.id); },
    markRead: (id) => { setItems(current => current.map(i => i.id === id ? { ...i, read: true } : i)); if (supabase && user) void supabase.from("notifications").update({ read: true }).eq("id", id).eq("user_id", user.id); },
    push: (n) => setItems(prev => [{ ...n, id: "n" + Math.random().toString(36).slice(2, 7), createdAt: new Date().toISOString(), read: false }, ...prev]),
  }}>{children}</C.Provider>;
}
export const useNotifications = () => useContext(C)!;
