import { NavLink, Outlet, Navigate } from "react-router-dom";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { Bookmark, FileText, Folder, LayoutDashboard, Bell, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/saved", label: "Saved Grants", icon: Bookmark },
  { to: "/dashboard/applications", label: "Applications", icon: FileText },
  { to: "/dashboard/matches", label: "AI Matches", icon: Sparkles },
  { to: "/dashboard/documents", label: "Document Vault", icon: Folder },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950">
      <Header />
      <div className="container-page py-4 sm:py-6 flex-1 grid gap-4 sm:gap-6 md:grid-cols-[240px_1fr]">
        <aside className="md:sticky md:top-20 h-max">
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
