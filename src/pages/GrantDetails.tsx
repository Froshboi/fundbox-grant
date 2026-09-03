import { Link, Navigate, useParams } from "react-router-dom";
import { Bookmark, BookmarkCheck, Calendar, CheckCircle2, ChevronRight, FileText, MapPin } from "lucide-react";
import { GRANTS } from "@/data/grants";
import { STORIES } from "@/data/stories";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { useApplications } from "@/contexts/ApplicationContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";

export default function GrantDetails() {
  const { id } = useParams();
  const grant = GRANTS.find(g => g.id === id);
  const { has, toggle } = useBookmarks();
  const { add } = useApplications();
  const { push } = useNotifications();
  const { user } = useAuth();

  if (!grant) return <Navigate to="/404" replace />;

  const similar = GRANTS.filter(g => g.category === grant.category && g.id !== grant.id).slice(0, 3);
  const story = STORIES.find(s => s.category === grant.category);

  function startApplication() {
    add({
      grantId: grant!.id, grantTitle: grant!.title, status: "Draft",
      submittedAt: null, amountRequested: grant!.fundingAmount,
    });
    push({ title: `Draft started: ${grant!.title}`, body: "You can complete this application from your dashboard.", type: "application" });
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-page pt-6 text-sm muted flex items-center gap-1">
        <Link to="/grants">Grants</Link><ChevronRight className="h-3 w-3" /><span className="truncate">{grant.title}</span>
      </div>

      {/* Header */}
      <div className="container-page py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-brand-100 text-brand-800 dark:bg-brand-600/20 dark:text-brand-300">{grant.category}</span>
          <span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">{grant.status}</span>
          <span className="chip bg-ink-100 dark:bg-ink-800">{grant.matchPercentage}% match</span>
        </div>
        <h1 className="h2 mt-3">{grant.title}</h1>
        <div className="muted mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span>{grant.provider}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {grant.location}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Closes {formatDate(grant.deadline)} · {daysUntil(grant.deadline)} days</span>
        </div>
      </div>

      <div className="container-page pb-16 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8 min-w-0">
          <section className="card p-6">
            <h2 className="h3">Program Overview</h2>
            <p className="mt-3 text-sm leading-relaxed">{grant.overview}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {grant.tags.map(t => <span key={t} className="chip bg-ink-100 dark:bg-ink-800">{t}</span>)}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="h3">Eligibility Requirements</h2>
            <ul className="mt-3 space-y-2">
              {grant.eligibility.map(e => (
                <li key={e} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" /> {e}</li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="h3">Required Documentation</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2">
              {grant.requiredDocuments.map(d => (
                <li key={d} className="flex items-center gap-2 text-sm p-3 rounded-lg border border-ink-100 dark:border-ink-800">
                  <FileText className="h-4 w-4 text-ink-500" /> {d}
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="h3">Timeline</h2>
            <ol className="mt-3 relative border-l border-ink-200 dark:border-ink-700 ml-2">
              {grant.timeline.map(t => (
                <li key={t.label} className="ml-4 py-2">
                  <div className="absolute -left-1.5 h-3 w-3 rounded-full bg-brand-500" />
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="text-xs muted">{formatDate(t.date)}</div>
                </li>
              ))}
            </ol>
          </section>

          <section className="card p-6">
            <h2 className="h3">Frequently Asked Questions</h2>
            <div className="mt-3 divide-y divide-ink-100 dark:divide-ink-800">
              {grant.faq.map(f => (
                <details key={f.q} className="py-3 group">
                  <summary className="cursor-pointer text-sm font-medium list-none flex items-center justify-between">
                    {f.q}<ChevronRight className="h-4 w-4 group-open:rotate-90 transition" />
                  </summary>
                  <p className="mt-2 text-sm muted">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {story && (
            <section className="card p-6">
              <h2 className="h3">Success Story</h2>
              <blockquote className="mt-3 border-l-2 border-brand-500 pl-4 italic text-ink-700 dark:text-ink-200">"{story.quote}"</blockquote>
              <div className="text-sm muted mt-2">— {story.founder}, {story.organization} ({story.location})</div>
              <p className="mt-3 text-sm">{story.story}</p>
            </section>
          )}
        </div>

        {/* Sticky sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 h-max">
          <div className="card p-6">
            <div className="text-xs uppercase muted">Funding amount</div>
            <div className="font-display text-3xl font-bold text-brand-600 dark:text-brand-400 mt-1">{formatCurrency(grant.fundingAmount)}</div>
            <div className="text-xs muted mt-1">Range {formatCurrency(grant.fundingRangeLow)}–{formatCurrency(grant.fundingRangeHigh)}</div>
            <div className="mt-4 space-y-2">
              {user ? (
                <button onClick={startApplication} className="btn-primary w-full">Start Application</button>
              ) : (
                <Link to="/auth?mode=signup" className="btn-primary w-full">Sign up to apply</Link>
              )}
              <button onClick={() => toggle(grant.id)} className="btn-outline w-full">
                {has(grant.id) ? <><BookmarkCheck className="h-4 w-4" /> Saved</> : <><Bookmark className="h-4 w-4" /> Save grant</>}
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-800 text-xs muted space-y-1">
              <div>Status: <b className="text-ink-800 dark:text-ink-200">{grant.status}</b></div>
              <div>Match: <b className="text-brand-600 dark:text-brand-400">{grant.matchPercentage}%</b></div>
              <div>Deadline: <b className="text-ink-800 dark:text-ink-200">{formatDate(grant.deadline)}</b></div>
            </div>
          </div>

          <div className="card p-6">
            <div className="text-sm font-semibold mb-3">Similar Opportunities</div>
            <div className="space-y-3">
              {similar.map(s => (
                <Link key={s.id} to={`/grants/${s.id}`} className="block group">
                  <div className="text-sm font-medium group-hover:text-brand-600">{s.title}</div>
                  <div className="text-xs muted">{formatCurrency(s.fundingAmount)} · {s.provider}</div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
