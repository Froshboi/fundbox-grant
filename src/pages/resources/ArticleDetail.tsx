import { Link, Navigate, useParams } from "react-router-dom";
import { ARTICLES } from "@/data/articles";
import { formatDate } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

export default function ArticleDetail() {
  const { slug } = useParams();
  const a = ARTICLES.find(x => x.slug === slug);
  if (!a) return <Navigate to="/404" replace />;
  const related = ARTICLES.filter(x => x.category === a.category && x.id !== a.id).slice(0, 3);
  return (
    <div className="container-page py-10 grid gap-10 lg:grid-cols-[1fr_280px]">
      <article className="max-w-3xl">
        <Link to="/resources" className="text-sm link inline-flex items-center gap-1 mb-6"><ChevronLeft className="h-4 w-4" /> All resources</Link>
        <div className="chip bg-brand-100 text-brand-800 dark:bg-brand-600/20 dark:text-brand-300">{a.category}</div>
        <h1 className="h2 mt-3">{a.title}</h1>
        <div className="text-sm muted mt-3">{a.author} · {formatDate(a.publishedAt)} · {a.readMinutes} min read</div>
        <div className="prose prose-sm max-w-none mt-8 text-ink-700 dark:text-ink-200 space-y-4">
          {a.body.split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) return <h2 key={i} className="font-display text-xl font-semibold mt-6">{block.slice(3)}</h2>;
            if (/^\d\./.test(block)) return <ol key={i} className="list-decimal pl-5 space-y-1">{block.split("\n").map((l, j) => <li key={j}>{l.replace(/^\d+\.\s*/, "")}</li>)}</ol>;
            if (block.startsWith("- ")) return <ul key={i} className="list-disc pl-5 space-y-1">{block.split("\n").map((l, j) => <li key={j}>{l.replace(/^- /, "")}</li>)}</ul>;
            return <p key={i}>{block}</p>;
          })}
        </div>
      </article>
      <aside className="lg:sticky lg:top-20 h-max">
        <div className="card p-5">
          <div className="font-semibold text-sm mb-3">Related articles</div>
          <div className="space-y-3">
            {related.map(r => (
              <Link key={r.id} to={`/resources/${r.slug}`} className="block group">
                <div className="text-sm font-medium group-hover:text-brand-600">{r.title}</div>
                <div className="text-xs muted">{formatDate(r.publishedAt)}</div>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
