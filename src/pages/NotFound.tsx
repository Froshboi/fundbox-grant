import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <div className="font-display text-7xl font-bold text-brand-600">404</div>
      <div className="mt-4 h3">Page not found</div>
      <p className="muted mt-2">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-6"><Link to="/" className="btn-primary">Go home</Link></div>
    </div>
  );
}
