import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/layout/Logo";
import { checkSupabaseConnection, isSupabaseConfigured } from "@/lib/supabase";

export default function Auth() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(params.get("mode") === "signup" ? "signup" : "signin");
  const { user, login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [connection, setConnection] = useState("Checking Supabase connection...");
  const nav = useNavigate();

  useEffect(() => {
    checkSupabaseConnection()
      .then(setConnection)
      .catch(error => setConnection(error instanceof Error ? `Supabase connection failed: ${error.message}` : "Supabase connection failed."));
  }, []);

  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null); setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      if (mode === "signup") {
        await signup({
          email: String(fd.get("email")),
          password: String(fd.get("password")),
          name: String(fd.get("name")),
          organization: String(fd.get("organization")),
        });
      } else {
        await login(String(fd.get("email")), String(fd.get("password")));
      }
      nav("/dashboard");
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
      <div className="hidden md:block bg-gradient-to-br from-brand-600 to-brand-800 text-white p-12 relative">
        <Logo className="[&_span]:text-white [&_.text-brand-600]:text-white/70" />
        <div className="mt-16 max-w-md">
          <h2 className="font-display text-3xl font-bold">Join 12,000+ US organizations funding what's next.</h2>
          <p className="mt-4 text-white/80">Access $125M+ in grant opportunities matched to your organization's profile — in one professional dashboard.</p>
          <ul className="mt-8 space-y-3 text-sm text-white/90">
            <li>· 450+ actively curated grant programs</li>
            <li>· AI matching against your organization profile</li>
            <li>· Reusable document vault for every application</li>
            <li>· Real-time status tracking and notifications</li>
          </ul>
        </div>
      </div>
      <div className="p-8 md:p-16 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <div className="md:hidden mb-8"><Logo /></div>
          <h1 className="font-display text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="muted text-sm mt-1">
            {mode === "signin" ? "Sign in to your Fundbox Grants dashboard." : "Free forever. No credit card required."}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="label">Full name</label>
                  <input required name="name" className="input" defaultValue="Jamie Rivera" />
                </div>
                <div>
                  <label className="label">Organization</label>
                  <input required name="organization" className="input" defaultValue="Rivera Robotics LLC" />
                </div>
              </>
            )}
            <div>
              <label className="label">Email</label>
              <input required type="email" name="email" className="input" placeholder="you@company.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input required minLength={8} type="password" name="password" className="input" placeholder="8+ characters" />
            </div>
            {err && <div className="text-sm text-red-600">{err}</div>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <div className="text-sm muted mt-6">
            {mode === "signin" ? (
              <>Don't have an account? <button className="link" onClick={() => setMode("signup")}>Create one</button></>
            ) : (
              <>Already have an account? <button className="link" onClick={() => setMode("signin")}>Sign in</button></>
            )}
          </div>
          <div className="mt-8 p-4 rounded-lg bg-ink-50 dark:bg-ink-900 text-xs">
            <div className="font-semibold mb-1">{isSupabaseConfigured ? "Secure authentication enabled" : "Local development mode"}</div>
            {isSupabaseConfigured ? (
              <div className={connection.startsWith("Connected") ? "text-emerald-600" : "text-red-600"}>{connection} Email verification may be required.</div>
            ) : (
              <div className="muted">Authentication is unavailable until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.</div>
            )}
          </div>
          <div className="text-xs muted mt-6">
            By continuing you agree to our <Link to="/legal/terms" className="link">Terms</Link> and <Link to="/legal/privacy" className="link">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
