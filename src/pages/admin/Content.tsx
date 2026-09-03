import { useState } from "react";
import { ARTICLES } from "@/data/articles";
import { formatDate } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

export default function AdminContent() {
  const [q, setQ] = useState("");
  const list = ARTICLES.filter(a => !q || a.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="h3">Content Management</h1><p className="muted text-sm">{ARTICLES.length} articles across guides, news, and webinars.</p></div>
        <div className="flex gap-2">
          <input className="input max-w-xs" value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." />
          <button className="btn-primary">+ New article</button>
        </div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-ink-50 dark:bg-ink-900 text-xs uppercase muted">
            <tr><th className="text-left p-3">Article</th><th className="text-left p-3">Category</th><th className="text-left p-3">Author</th><th className="text-left p-3">Published</th><th className="text-left p-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {list.map(a => (
              <tr key={a.id}>
                <td className="p-3"><div className="font-medium">{a.title}</div><div className="text-xs muted">{a.readMinutes} min · {a.slug}</div></td>
                <td className="p-3 text-xs">{a.category}</td>
                <td className="p-3 text-xs">{a.author}</td>
                <td className="p-3 text-xs">{formatDate(a.publishedAt)}</td>
                <td className="p-3 text-right"><div className="flex gap-1 justify-end"><button className="btn-ghost p-2"><Pencil className="h-4 w-4" /></button><button className="btn-ghost p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
