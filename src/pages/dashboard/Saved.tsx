import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { GRANTS } from "@/data/grants";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function Saved() {
  const { ids, toggle } = useBookmarks();
  const saved = GRANTS.filter(g => ids.includes(g.id));
  return (
    <div className="space-y-4">
      <div>
        <h1 className="h3">Saved Grants</h1>
        <p className="muted text-sm">{saved.length} bookmarked opportunities.</p>
      </div>
      {saved.length === 0 && (
        <div className="card p-10 text-center">
          <Bookmark className="h-6 w-6 mx-auto text-ink-400" />
          <div className="font-semibold mt-2">Nothing saved yet</div>
          <p className="muted text-sm mt-1">Bookmark grants from the marketplace to keep an eye on deadlines.</p>
          <Link to="/grants" className="btn-primary mt-4 inline-flex">Browse marketplace</Link>
        </div>
      )}
      {saved.map(g => (
        <div key={g.id} className="card p-5 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <Link to={`/grants/${g.id}`} className="font-semibold hover:text-brand-600">{g.title}</Link>
            <div className="text-xs muted">{g.provider}</div>
            <div className="text-sm mt-1"><b>{formatCurrency(g.fundingAmount)}</b> · Deadline {formatDate(g.deadline)}</div>
          </div>
          <button onClick={() => toggle(g.id)} className="btn-ghost p-2"><BookmarkCheck className="h-5 w-5 text-brand-600" /></button>
          <Link to={`/grants/${g.id}`} className="btn-outline">View</Link>
        </div>
      ))}
    </div>
  );
}
