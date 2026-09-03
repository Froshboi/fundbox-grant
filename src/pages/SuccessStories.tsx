import { STORIES } from "@/data/stories";
import { formatCurrency } from "@/lib/utils";
import { Quote } from "lucide-react";

export default function SuccessStories() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <h1 className="h2">Success Stories</h1>
        <p className="muted mt-2">Real organizations funded through the Fundbox Grants platform.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {STORIES.map(s => (
          <article key={s.id} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{s.organization}</div>
                <div className="text-sm muted">{s.founder} · {s.location}</div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase muted">Awarded</div>
                <div className="font-display font-bold text-brand-600 dark:text-brand-400">{formatCurrency(s.amount)}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip bg-brand-100 text-brand-800 dark:bg-brand-600/20 dark:text-brand-300">{s.category}</span>
              <span className="chip bg-ink-100 dark:bg-ink-800">{s.grantAwarded}</span>
              <span className="chip bg-ink-100 dark:bg-ink-800">{s.year}</span>
            </div>
            <blockquote className="mt-4 relative pl-6 text-ink-700 dark:text-ink-200 italic">
              <Quote className="h-4 w-4 absolute left-0 top-1 text-brand-500" /> {s.quote}
            </blockquote>
            <p className="mt-4 text-sm">{s.story}</p>
            <div className="mt-4 text-sm">
              <div className="font-semibold mb-2">Outcomes</div>
              <ul className="space-y-1">
                {s.outcomes.map(o => <li key={o} className="muted">· {o}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
