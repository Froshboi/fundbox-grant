import { NavLink, Outlet, Navigate } from "react-router-dom";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, FileCheck, Files, Newspaper, ScrollText, Settings, Users, Wallet, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "Analytics", icon: BarChart3, end: true },
  { to: "/admin/applicants", label: "Applicants", icon: Users },
  { to: "/admin/grants", label: "Grants", icon: Wallet },
  { to: "/admin/reviews", label: "Application Reviews", icon: FileCheck },
  { to: "/admin/content", label: "Content (Blog)", icon: Newspaper },
  { to: "/admin/documents", label: "Documents", icon: Files },
  { to: "/admin/audit", label: "Audit Logs", icon: ScrollText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/support", label: "Support Inbox", icon: MessageSquare },
];

export function AdminLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950">
      <Header />
      <div className="container-page py-4 sm:py-6 flex-1 grid gap-4 sm:gap-6 md:grid-cols-[240px_1fr]">
        <aside className="md:sticky md:top-20 h-max">
          <div className="card p-3 mb-3">
            <div className="text-xs muted">Signed in as</div>
            <div className="font-semibold text-sm">{user.name}</div>
            <div className="chip bg-brand-100 text-brand-800 dark:bg-brand-600/20 dark:text-brand-300 mt-1">Administrator</div>
          </div>
          <nav className="card p-2 space-y-0.5 max-h-[45vh] overflow-y-auto md:max-h-none">
            {items.map(i => (
              <NavLink key={i.to} to={i.to} end={i.end}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800",
                  isActive && "bg-brand-50 dark:bg-brand-600/10 text-brand-700 dark:text-brand-300"
                )}>
                <i.icon className="h-4 w-4" /> {i.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0"><Outlet /></main>
      </div>
    </div>
  );
}
