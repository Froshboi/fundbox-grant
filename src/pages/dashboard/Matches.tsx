import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { GRANTS } from "@/data/grants";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";

export default function Matches() {
  const { profile, profileCompletion } = useAuth();
  const orgName = profile.legalName || "your organization";
  const top = [...GRANTS].sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h3 flex items-center gap-2"><Sparkles className="h-5 w-5 text-brand-600" /> AI Grant Matches</h1>
        <p className="muted text-sm">Recommendations based on your organization profile.</p>
      </div>

      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Profile completeness: {profileCompletion}%</div>
            <p className="text-sm muted mt-1">Higher completeness improves match accuracy.</p>
          </div>
          <Link to="/dashboard/profile" className="btn-outline">Update profile</Link>
        </div>
      </div>

      <div className="space-y-3">
        {top.map(g => (
          <Link key={g.id} to={`/grants/${g.id}`} className="card p-5 flex items-center gap-4 hover:shadow-pop transition">
            <div className="w-14 text-center">
              <div className="font-display text-xl font-bold text-brand-600 dark:text-brand-400">{g.matchPercentage}%</div>
              <div className="text-[10px] uppercase muted">match</div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{g.title}</div>
              <div className="text-sm muted">"{orgName} matches strongly on {g.category.toLowerCase()} eligibility, funding stage, and geographic scope."</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(g.fundingAmount)}</div>
              <div className="text-xs muted">{g.provider}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
