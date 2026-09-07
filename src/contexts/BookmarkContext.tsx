import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Ctx { ids: string[]; toggle: (id: string) => void; has: (id: string) => boolean }
const C = createContext<Ctx | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    if (!supabase || !user) { setIds([]); return; }
    supabase.from("user_bookmarks").select("grant_id").eq("user_id", user.id).then(({ data }) => setIds((data ?? []).map(row => row.grant_id)));
  }, [user]);
  return <C.Provider value={{
    ids,
    has: (id) => ids.includes(id),
    toggle: (id) => {
      if (!supabase || !user) return;
      if (ids.includes(id)) {
        void supabase.from("user_bookmarks").delete().eq("user_id", user.id).eq("grant_id", id);
        setIds(prev => prev.filter(x => x !== id));
      } else {
        void supabase.from("user_bookmarks").insert({ user_id: user.id, grant_id: id });
        setIds(prev => [...prev, id]);
      }
    },
  }}>{children}</C.Provider>;
}
export const useBookmarks = () => useContext(C)!;
