import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/layout/Logo";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "reset">(params.get("mode") === "signup" ? "signup" : params.get("mode") === "reset" ? "reset" : "signin");
  const { user, login, signup, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

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
      } else if (mode === "forgot") {
        await resetPassword(String(fd.get("email")));
        setErr("If an account exists for that email, a reset link has been sent.");
        return;
      } else if (mode === "reset") {
        if (!supabase) throw new Error("Authentication is not configured.");
        const { error } = await supabase.auth.updateUser({ password: String(fd.get("password")) });
        if (error) throw error;
        nav("/dashboard");
        return;
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
          <h1 className="font-display text-2xl font-bold">{mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Choose a new password"}</h1>
          <p className="muted text-sm mt-1">
            {mode === "signin" ? "Sign in to your Fundbox Grants dashboard." : mode === "signup" ? "Create your account to get started." : "Enter your email to receive a secure reset link."}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="label">Full name</label>
                  <input required name="name" className="input" />
                </div>
                <div>
                  <label className="label">Organization</label>
                  <input required name="organization" className="input" />
                </div>
              </>
            )}
            {mode !== "reset" && <div>
              <label className="label">Email</label>
              <input required type="email" name="email" className="input" placeholder="you@company.com" />
            </div>}
            {mode !== "forgot" && <div>
              <label className="label">Password</label>
              <input required minLength={8} type="password" name="password" className="input" placeholder="8+ characters" />
            </div>}
            {err && <div className="text-sm text-red-600">{err}</div>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Update password"}
            </button>
          </form>
          <div className="text-sm muted mt-6">
            {mode === "signin" ? (
              <><button className="link" onClick={() => setMode("forgot")}>Forgot password?</button><br />Don't have an account? <button className="link" onClick={() => setMode("signup")}>Create one</button></>
            ) : (
              <>Remembered your password? <button className="link" onClick={() => setMode("signin")}>Sign in</button></>
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
