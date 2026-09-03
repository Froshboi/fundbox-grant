import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
  logout: () => void;
  updateProfile: (patch: Partial<OrgProfile>) => void;
  profileCompletion: number;
}

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE = "fb-user";
const PROFILE_KEY = "fb-profile";

const seedUsers: User[] = [
  { id: "u-admin", email: "admin@fundboxgrants.com", name: "Alex Morgan", role: "admin", organization: "Fundbox Grants Ltd", createdAt: new Date().toISOString() },
  { id: "u-demo", email: "demo@fundboxgrants.com", name: "Jamie Rivera", role: "applicant", organization: "Rivera Robotics LLC", createdAt: new Date().toISOString() },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE);
    return raw ? JSON.parse(raw) : null;
  });
  const [profile, setProfile] = useState<OrgProfile>(() => {
    if (typeof window === "undefined") return emptyProfile;
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...emptyProfile, ...JSON.parse(raw) } : emptyProfile;
  });

  useEffect(() => {
    user ? localStorage.setItem(STORAGE, JSON.stringify(user)) : localStorage.removeItem(STORAGE);
  }, [user]);
  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  async function login(email: string) {
    const found = seedUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || seedUsers[1];
    setUser(found);
    return found;
  }

  async function signup(data: { email: string; password: string; name: string; organization: string; role?: Role }) {
    const u: User = {
      id: "u-" + Math.random().toString(36).slice(2, 9),
      email: data.email, name: data.name, organization: data.organization,
      role: data.role || "applicant", createdAt: new Date().toISOString(),
    };
    setUser(u);
    setProfile(p => ({ ...p, legalName: data.organization }));
    return u;
  }

  function logout() { setUser(null); }

  function updateProfile(patch: Partial<OrgProfile>) {
    setProfile(p => ({ ...p, ...patch }));
  }

  const fields: (keyof OrgProfile)[] = ["legalName","ein","industry","annualRevenue","employeeCount","stateOfIncorporation","entityType","yearFounded","website","mission"];
  const filled = fields.filter(f => (profile[f] as string)?.length > 0).length;
  const arrayBonus = (profile.diversityStatus.length > 0 ? 1 : 0) + (profile.certifications.length > 0 ? 1 : 0);
  const profileCompletion = Math.round(((filled + arrayBonus) / (fields.length + 2)) * 100);

  return <Ctx.Provider value={{ user, profile, login, signup, logout, updateProfile, profileCompletion }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx)!;
