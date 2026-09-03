import { useState } from "react";
import { Link } from "react-router-dom";
import { ARTICLES } from "@/data/articles";
import { formatDate } from "@/lib/utils";

const categories = ["All", "Grant Writing", "Funding News", "Guides", "Templates", "Webinars"] as const;

export default function Resources() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [q, setQ] = useState("");
  const filtered = ARTICLES.filter(a =>
    (cat === "All" || a.category === cat) &&
    (!q || a.title.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <h1 className="h2">Resource Center</h1>
        <p className="muted mt-2">Grant writing guides, funding news, templates, and live webinars from our team and partners.</p>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={"chip px-3 py-1.5 " + (cat === c ? "bg-brand-600 text-white" : "bg-ink-100 dark:bg-ink-800 text-ink-800 dark:text-ink-200")}>
            {c}
          </button>
        ))}
        <input className="input ml-auto max-w-xs" placeholder="Search articles..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a => (
          <Link key={a.id} to={`/resources/${a.slug}`} className="card p-5 hover:shadow-pop transition block">
            <div className="chip bg-brand-100 text-brand-800 dark:bg-brand-600/20 dark:text-brand-300">{a.category}</div>
            <div className="font-semibold mt-3">{a.title}</div>
            <p className="text-sm muted mt-2 line-clamp-2">{a.excerpt}</p>
            <div className="text-xs muted mt-4 flex items-center justify-between">
              <span>{a.author}</span>
              <span>{formatDate(a.publishedAt)} · {a.readMinutes} min</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
