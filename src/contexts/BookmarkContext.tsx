import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const KEY = "fb-bookmarks";
interface Ctx { ids: string[]; toggle: (id: string) => void; has: (id: string) => boolean }
const C = createContext<Ctx | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(ids)); }, [ids]);
  return <C.Provider value={{
    ids,
    has: (id) => ids.includes(id),
    toggle: (id) => setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]),
  }}>{children}</C.Provider>;
}
export const useBookmarks = () => useContext(C)!;
