import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Matches() {
  const { profileCompletion } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h3 flex items-center gap-2"><Sparkles className="h-5 w-5 text-brand-600" /> AI Grant Matches</h1>
        <p className="muted text-sm">Recommendations based on your organization profile.</p>
      </div>

      <div className="card p-8 text-center">
        <Sparkles className="h-8 w-8 mx-auto text-brand-600" />
        <h2 className="font-semibold mt-3">No matches yet</h2>
        <p className="muted text-sm mt-1">Complete your organization profile to generate personalized grant matches.</p>
        <p className="text-xs muted mt-2">Profile completion: {profileCompletion}%</p>
        <Link to="/dashboard/profile" className="btn-primary mt-5">Complete profile</Link>
      </div>
    </div>
  );
}
