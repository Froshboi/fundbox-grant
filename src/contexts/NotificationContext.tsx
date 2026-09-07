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


interface Ctx { items: Notif[]; unread: number; markAllRead: () => void; markRead: (id: string) => void; push: (n: Omit<Notif, "id" | "createdAt" | "read">) => void }
const C = createContext<Ctx | null>(null);
const KEY = "fb-notifs";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = `${KEY}-${user?.id ?? "anonymous"}`;
  const [items, setItems] = useState<Notif[]>(() => {
    if (typeof window === "undefined") return [];
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
