import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type Role = "applicant" | "admin";
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  organization?: string;
  createdAt: string;
}

export interface OrgProfile {
  legalName: string;
  ein: string;
  industry: string;
  annualRevenue: string;
  employeeCount: string;
  stateOfIncorporation: string;
  entityType: string;
  diversityStatus: string[];
  certifications: string[];
  yearFounded: string;
  website: string;
  mission: string;
}

const emptyProfile: OrgProfile = {
  legalName: "", ein: "", industry: "", annualRevenue: "", employeeCount: "",
  stateOfIncorporation: "", entityType: "", diversityStatus: [], certifications: [],
  yearFounded: "", website: "", mission: "",
};

interface AuthCtx {
  user: User | null;
  profile: OrgProfile;
  login: (email: string, _password: string) => Promise<User>;
  signup: (data: { email: string; password: string; name: string; organization: string; role?: Role }) => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: Partial<OrgProfile>) => Promise<void>;
  profileCompletion: number;
}

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE = "fb-user";
const PROFILE_KEY = "fb-profile";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    if (supabase) return null;
    const raw = localStorage.getItem(STORAGE);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user ? fromSupabaseUser(data.user) : null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? fromSupabaseUser(session.user) : null);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);
  const [profile, setProfile] = useState<OrgProfile>(() => {
    if (typeof window === "undefined") return emptyProfile;
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...emptyProfile, ...JSON.parse(raw) } : emptyProfile;
  });

  useEffect(() => {
    user ? localStorage.setItem(STORAGE, JSON.stringify(user)) : localStorage.removeItem(STORAGE);
  }, [user]);
  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(`${PROFILE_KEY}-${user.id}`);
    setProfile(raw ? { ...emptyProfile, ...JSON.parse(raw) } : { ...emptyProfile, legalName: user.organization ?? "" });
  }, [user]);
  useEffect(() => {
    if (user) localStorage.setItem(`${PROFILE_KEY}-${user.id}`, JSON.stringify(profile));
  }, [profile, user]);

  async function login(email: string, password: string) {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error("Sign in did not return a user.");
      const next = fromSupabaseUser(data.user);
      setUser(next);
      return next;
    }
    throw new Error("Authentication is not configured. Add the Supabase environment variables and try again.");
  }

  async function signup(data: { email: string; password: string; name: string; organization: string; role?: Role }) {
    if (supabase) {
      const { data: result, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { name: data.name, organization: data.organization } },
      });
      if (error) throw error;
      if (!result.user) throw new Error("Account creation did not return a user.");
      const next = fromSupabaseUser(result.user);
      if (!result.session) {
        throw new Error("Account created. Check your email to confirm your account, then sign in.");
      }

      setUser(next);
      setProfile(p => ({ ...p, legalName: data.organization }));
      return next;
    }
    throw new Error("Authentication is not configured. Add the Supabase environment variables and try again.");
  }

  async function resetPassword(email: string) {
    if (!supabase) throw new Error("Authentication is not configured.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });
    if (error) throw error;
  }

  async function logout() {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setUser(null);
  }

  async function updateProfile(patch: Partial<OrgProfile>) {
    setProfile(p => ({ ...p, ...patch }));
    if (supabase && user) {
      const { error } = await supabase.auth.updateUser({ data: { profile: { ...profile, ...patch } } });
      if (error) throw error;
    }
  }

  const fields: (keyof OrgProfile)[] = ["legalName","ein","industry","annualRevenue","employeeCount","stateOfIncorporation","entityType","yearFounded","website","mission"];
  const filled = fields.filter(f => (profile[f] as string)?.length > 0).length;
  const arrayBonus = (profile.diversityStatus.length > 0 ? 1 : 0) + (profile.certifications.length > 0 ? 1 : 0);
  const profileCompletion = Math.round(((filled + arrayBonus) / (fields.length + 2)) * 100);

  return <Ctx.Provider value={{ user, profile, login, signup, resetPassword, logout, updateProfile, profileCompletion }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx)!;

function fromSupabaseUser(value: { id: string; email?: string; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown>; created_at?: string }): User {
  const metadata = value.user_metadata ?? {};
  const appMetadata = value.app_metadata ?? {};
  return {
    id: value.id,
    email: value.email ?? "",
    name: typeof metadata.name === "string" ? metadata.name : value.email?.split("@")[0] ?? "Applicant",
    organization: typeof metadata.organization === "string" ? metadata.organization : undefined,
    role: appMetadata.role === "admin" ? "admin" : "applicant",
    createdAt: value.created_at ?? new Date().toISOString(),
  };
}
