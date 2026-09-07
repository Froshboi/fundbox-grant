import { Link } from "react-router-dom";

export default function Applications() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="h3">Applications</h1>
        <p className="muted text-sm">Track every application from draft to award.</p>
      </div>
      <div className="card p-8 text-center">
        <h2 className="font-semibold">No applications yet</h2>
        <p className="muted text-sm mt-1">Applications you start and submit will appear here.</p>
        <Link to="/grants" className="btn-primary mt-5">Browse grants</Link>
      </div>
    </div>
  );
}
