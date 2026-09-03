import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bell, Menu, Moon, Sun, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/grants", label: "Grants" },
  { to: "/resources", label: "Resources" },
  { to: "/success-stories", label: "Success Stories" },
  { to: "/support", label: "Support" },
];

export function Header() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { unread } = useNotifications();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const nav_ = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 dark:border-ink-800 bg-white/80 dark:bg-ink-950/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            {nav.map(n => (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) => cn(
                  "text-sm font-medium text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400 transition",
                  isActive && "text-brand-600 dark:text-brand-400"
                )}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Toggle theme" onClick={toggle} className="btn-ghost p-2">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user && (
            <Link to="/dashboard/notifications" aria-label="Notifications" className="btn-ghost p-2 relative">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-500" />
              )}
            </Link>
          )}
          {user ? (
            <div className="relative">
              <button className="btn-outline hidden sm:inline-flex" onClick={() => setMenu(m => !m)}>
                <User className="h-4 w-4" /> {user.name.split(" ")[0]}
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 card p-2 z-50">
                  <div className="px-3 py-2">
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs muted">{user.email}</div>
                  </div>
                  <hr className="my-1 border-ink-100 dark:border-ink-800" />
                  <Link className="block px-3 py-2 text-sm hover:bg-ink-50 dark:hover:bg-ink-800 rounded" to="/dashboard">Dashboard</Link>
                  <Link className="block px-3 py-2 text-sm hover:bg-ink-50 dark:hover:bg-ink-800 rounded" to="/dashboard/profile">Profile</Link>
                  {user.role === "admin" && (
                    <Link className="block px-3 py-2 text-sm hover:bg-ink-50 dark:hover:bg-ink-800 rounded" to="/admin">Admin</Link>
                  )}
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-ink-50 dark:hover:bg-ink-800 rounded text-red-600"
                    onClick={() => { logout(); setMenu(false); nav_("/"); }}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth" className="btn-ghost hidden sm:inline-flex">Sign in</Link>
              <Link to="/auth?mode=signup" className="btn-primary">Get started</Link>
            </>
          )}
          <button className="md:hidden btn-ghost p-2" onClick={() => setOpen(o => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-ink-100 dark:border-ink-800 px-4 py-3 space-y-1">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium">{n.label}</NavLink>
          ))}
          {!user && <Link to="/auth" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Sign in</Link>}
          {user && <Link to="/dashboard" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Dashboard</Link>}
        </div>
      )}
    </header>
  );
}
