import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-950">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm muted max-w-xs">
            Grant discovery and application management for US small businesses, startups, and nonprofits.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Platform</div>
          <ul className="space-y-2 text-sm muted">
            <li><Link to="/grants">Grant Marketplace</Link></li>
            <li><Link to="/dashboard">Applicant Dashboard</Link></li>
            <li><Link to="/success-stories">Success Stories</Link></li>
            <li><Link to="/resources">Resource Center</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm muted">
            <li><Link to="/support">Support</Link></li>
            <li><Link to="/resources">Blog</Link></li>
            <li><Link to="/legal/accessibility">Accessibility</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Legal</div>
          <ul className="space-y-2 text-sm muted">
            <li><Link to="/legal/terms">Terms of Service</Link></li>
            <li><Link to="/legal/privacy">Privacy Policy</Link></li>
            <li><Link to="/legal/cookies">Cookie Policy</Link></li>
            <li><Link to="/legal/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-page py-4 border-t border-ink-100 dark:border-ink-800 text-xs muted flex flex-col sm:flex-row justify-between gap-2">
        <div>© {new Date().getFullYear()} Fundbox Grants Ltd. All rights reserved.</div>
        <div>Fundbox Grants Ltd is a grant discovery and application management platform — not a lender.</div>
      </div>
    </footer>
  );
}
