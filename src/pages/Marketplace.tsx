import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Bookmark, BookmarkCheck, Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, GRANTS, type GrantCategory } from "@/data/grants";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { cn, daysUntil, formatCurrency, formatDate } from "@/lib/utils";

export default function Marketplace() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState<GrantCategory | "All">((params.get("category") as GrantCategory) || "All");
  const [minAmount, setMinAmount] = useState<number>(0);
  const [sort, setSort] = useState<"match" | "amount" | "deadline">("match");
  const [showFilters, setShowFilters] = useState(false);
  const { toggle, has } = useBookmarks();

  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (cat !== "All") next.set("category", cat);
    setParams(next, { replace: true });
  }, [q, cat, setParams]);

  const results = useMemo(() => {
    let r = GRANTS.filter(g => {
      if (cat !== "All" && g.category !== cat) return false;
      if (minAmount && g.fundingRangeHigh < minAmount) return false;
      if (q) {
        const s = q.toLowerCase();
        return g.title.toLowerCase().includes(s) || g.provider.toLowerCase().includes(s) || g.tags.join(" ").toLowerCase().includes(s);
      }
      return true;
    });
    r = [...r].sort((a, b) => {
      if (sort === "match") return b.matchPercentage - a.matchPercentage;
      if (sort === "amount") return b.fundingAmount - a.fundingAmount;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
    return r;
  }, [q, cat, minAmount, sort]);

  return (
    <div className="container-page py-8 md:py-12">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="h2">Grant Marketplace</h1>
          <p className="muted mt-1">{results.length} opportunities across {CATEGORIES.length} categories</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={sort} onChange={e => setSort(e.target.value as any)} className="input w-auto py-2">
            <option value="match">Sort: Best match</option>
            <option value="amount">Sort: Largest amount</option>
            <option value="deadline">Sort: Deadline soonest</option>
          </select>
          <button className="btn-outline md:hidden" onClick={() => setShowFilters(v => !v)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className={cn("card p-5 h-max md:sticky md:top-20", !showFilters && "hidden md:block")}>
          <div className="flex items-center justify-between mb-4 md:hidden">
            <div className="font-semibold">Filters</div>
            <button onClick={() => setShowFilters(false)}><X className="h-4 w-4" /></button>
          </div>
          <label className="label">Search</label>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" placeholder="Title, provider, tag" value={q} onChange={e => setQ(e.target.value)} />
          </div>

          <label className="label mt-5">Category</label>
          <div className="space-y-1 max-h-64 overflow-auto pr-1">
            <button className={cn("w-full text-left text-sm px-2 py-1.5 rounded", cat === "All" && "bg-brand-50 dark:bg-brand-600/10 text-brand-700 dark:text-brand-300")}
              onClick={() => setCat("All")}>All categories</button>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={cn("w-full text-left text-sm px-2 py-1.5 rounded hover:bg-ink-100 dark:hover:bg-ink-800",
                  cat === c && "bg-brand-50 dark:bg-brand-600/10 text-brand-700 dark:text-brand-300")}>{c}</button>
            ))}
          </div>

          <label className="label mt-5">Minimum funding: {formatCurrency(minAmount || 0)}</label>
          <input type="range" min={0} max={500000} step={10000} value={minAmount} onChange={e => setMinAmount(+e.target.value)} className="w-full accent-brand-600" />

          <button onClick={() => { setQ(""); setCat("All"); setMinAmount(0); }} className="btn-ghost w-full mt-4 text-sm">Reset filters</button>
        </aside>

        <div className="space-y-4">
          {results.length === 0 && (
            <div className="card p-10 text-center">
              <div className="font-semibold">No grants match your filters</div>
              <p className="muted text-sm mt-1">Try broadening your search or removing a category.</p>
            </div>
          )}
          {results.map(g => (
            <div key={g.id} className="card p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip bg-brand-100 text-brand-800 dark:bg-brand-600/20 dark:text-brand-300">{g.category}</span>
                    <span className={cn("chip",
                      g.status === "Open" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
                      g.status === "Closing Soon" && "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
                      g.status === "New" && "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
                      g.status === "Rolling" && "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300",
                    )}>{g.status}</span>
                    <span className="chip bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">{g.matchPercentage}% match</span>
                  </div>
                  <Link to={`/grants/${g.id}`} className="block font-semibold text-lg mt-2 hover:text-brand-600">{g.title}</Link>
                  <div className="text-sm muted mt-1">{g.provider} · {g.location}</div>
                  <p className="text-sm mt-3 line-clamp-2">{g.overview}</p>
                </div>
                <button onClick={() => toggle(g.id)} className="btn-ghost p-2" aria-label="Bookmark">
                  {has(g.id) ? <BookmarkCheck className="h-5 w-5 text-brand-600" /> : <Bookmark className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div><span className="muted">Funding: </span><b className="text-brand-700 dark:text-brand-400">{formatCurrency(g.fundingRangeLow)}–{formatCurrency(g.fundingRangeHigh)}</b></div>
                <div><span className="muted">Deadline: </span><b>{formatDate(g.deadline)}</b> <span className="muted">({daysUntil(g.deadline)}d)</span></div>
                <div className="ml-auto"><Link to={`/grants/${g.id}`} className="btn-primary py-2">View grant</Link></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
