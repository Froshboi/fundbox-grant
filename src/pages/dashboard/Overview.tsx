import { Link } from "react-router-dom";
import { ArrowUpRight, Bookmark, Clock, FileText, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApplications } from "@/contexts/ApplicationContext";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { GRANTS } from "@/data/grants";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";

export default function Overview() {
  const { user, profileCompletion } = useAuth();
  const { apps } = useApplications();
  const { ids } = useBookmarks();

  const submitted = apps.filter(a => a.status !== "Draft");
  const inReview = apps.filter(a => a.status === "In Review" || a.status === "Submitted").length;
  const approved = apps.filter(a => a.status === "Approved");
  const totalAwarded = approved.reduce((s, a) => s + a.amountRequested, 0);
  const upcoming = GRANTS
    .filter(g => ids.includes(g.id) || g.matchPercentage > 85)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  const widgets = [
    { label: "Saved grants", value: ids.length, icon: Bookmark, to: "/dashboard/saved" },
    { label: "Applications", value: apps.length, icon: FileText, to: "/dashboard/applications" },
    { label: "Pending reviews", value: inReview, icon: Clock, to: "/dashboard/applications" },
    { label: "Awarded", value: formatCurrency(totalAwarded || 0), icon: Sparkles, to: "/dashboard/applications" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h3">Welcome back, {user?.name?.split(" ")[0]}.</h1>
        <p className="muted text-sm">Here's what's happening across your grant portfolio.</p>
      </div>

      {profileCompletion < 100 && (
        <div className="card p-5 border-l-4 border-l-brand-500">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold">Complete your organization profile</div>
              <div className="text-sm muted">A complete profile unlocks higher-quality AI matches and faster applications.</div>
            </div>
            <Link to="/dashboard/profile" className="btn-primary">Continue profile</Link>
          </div>
          <div className="mt-3 h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
            <div className="h-full bg-brand-500" style={{ width: profileCompletion + "%" }} />
          </div>
          <div className="text-xs muted mt-1">{profileCompletion}% complete</div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {widgets.map(w => (
          <Link key={w.label} to={w.to} className="card p-5 hover:shadow-pop transition">
            <div className="flex items-center justify-between">
              <w.icon className="h-4 w-4 text-brand-600" />
              <ArrowUpRight className="h-4 w-4 muted" />
            </div>
            <div className="font-display text-2xl font-bold mt-3">{w.value}</div>
            <div className="text-xs muted">{w.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Recent applications</div>
            <Link to="/dashboard/applications" className="link text-sm">View all</Link>
          </div>
          <div className="mt-3 divide-y divide-ink-100 dark:divide-ink-800">
            {submitted.slice(0, 4).map(a => (
              <div key={a.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{a.grantTitle}</div>
                  <div className="text-xs muted">Updated {formatDate(a.updatedAt)}</div>
                </div>
                <span className="chip bg-ink-100 dark:bg-ink-800 text-xs">{a.status}</span>
              </div>
            ))}
            {submitted.length === 0 && <div className="py-6 text-sm muted text-center">No submitted applications yet.</div>}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Upcoming deadlines</div>
            <Link to="/grants" className="link text-sm">Browse grants</Link>
          </div>
          <div className="mt-3 divide-y divide-ink-100 dark:divide-ink-800">
            {upcoming.map(g => (
              <Link to={`/grants/${g.id}`} key={g.id} className="py-3 flex items-center justify-between gap-3 group">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate group-hover:text-brand-600">{g.title}</div>
                  <div className="text-xs muted">{formatCurrency(g.fundingAmount)} · {formatDate(g.deadline)}</div>
                </div>
                <span className="chip bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 text-xs">{daysUntil(g.deadline)}d</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
