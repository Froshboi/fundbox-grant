import { FormEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const industries = ["Technology", "Manufacturing", "Retail", "Food & Beverage", "Healthcare", "Education", "Nonprofit", "Professional Services", "Clean Energy", "Agriculture"];
const revenue = ["Pre-revenue", "$0–$100K", "$100K–$500K", "$500K–$1M", "$1M–$5M", "$5M+"];
const employees = ["1", "2–10", "11–50", "51–200", "201–500", "500+"];
const entities = ["LLC", "C-Corp", "S-Corp", "Sole Proprietor", "501(c)(3) Nonprofit", "Partnership"];
const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];
const diversityOptions = ["Women-Owned", "Minority-Owned", "Veteran-Owned", "LGBTQ+-Owned", "Disability-Owned"];
const certOptions = ["WBENC", "MBE", "VOSB", "SDVOSB", "8(a)", "HUBZone", "DBE"];

export default function Profile() {
  const { profile, updateProfile, profileCompletion, user } = useAuth();
  const [saved, setSaved] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(null);
    const fd = new FormData(e.currentTarget);
    try {
      await updateProfile({
      legalName: String(fd.get("legalName") || ""),
      ein: String(fd.get("ein") || ""),
      industry: String(fd.get("industry") || ""),
      annualRevenue: String(fd.get("annualRevenue") || ""),
      employeeCount: String(fd.get("employeeCount") || ""),
      stateOfIncorporation: String(fd.get("stateOfIncorporation") || ""),
      entityType: String(fd.get("entityType") || ""),
      yearFounded: String(fd.get("yearFounded") || ""),
      website: String(fd.get("website") || ""),
      mission: String(fd.get("mission") || ""),
      diversityStatus: diversityOptions.filter(o => fd.get("div_" + o) === "on"),
      certifications: certOptions.filter(o => fd.get("cert_" + o) === "on"),
      });
      setSaved("Profile saved.");
    } catch (error) {
      setSaved(error instanceof Error ? error.message : "Could not save profile.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h3">Organization Profile</h1>
          <p className="muted text-sm">The core of your AI matching — accurate profiles get better matches.</p>
        </div>
        <div className="text-right">
          <div className="text-xs muted">Completion</div>
          <div className="font-display text-2xl font-bold text-brand-600">{profileCompletion}%</div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card p-6 grid gap-5 md:grid-cols-2">
        <div><label className="label">Legal name</label><input name="legalName" className="input" defaultValue={profile.legalName || user?.organization} /></div>
        <div><label className="label">EIN</label><input name="ein" className="input" defaultValue={profile.ein} placeholder="12-3456789" /></div>
        <div>
          <label className="label">Industry</label>
          <select name="industry" defaultValue={profile.industry} className="input">
            <option value="">Select industry</option>
            {industries.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Entity type</label>
          <select name="entityType" defaultValue={profile.entityType} className="input">
            <option value="">Select entity type</option>
            {entities.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Annual revenue</label>
          <select name="annualRevenue" defaultValue={profile.annualRevenue} className="input">
            <option value="">Select revenue band</option>
            {revenue.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Employees</label>
          <select name="employeeCount" defaultValue={profile.employeeCount} className="input">
            <option value="">Select headcount</option>
            {employees.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="label">State of incorporation</label>
          <select name="stateOfIncorporation" defaultValue={profile.stateOfIncorporation} className="input">
            <option value="">Select state</option>
            {states.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div><label className="label">Year founded</label><input name="yearFounded" className="input" defaultValue={profile.yearFounded} placeholder="2019" /></div>
        <div className="md:col-span-2"><label className="label">Website</label><input name="website" className="input" defaultValue={profile.website} placeholder="https://" /></div>
        <div className="md:col-span-2"><label className="label">Mission / description</label><textarea name="mission" rows={3} className="input" defaultValue={profile.mission} placeholder="Describe what your organization does" /></div>

        <div className="md:col-span-2">
          <label className="label">Diversity status (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {diversityOptions.map(o => (
              <label key={o} className="chip bg-ink-100 dark:bg-ink-800 px-3 py-1.5 cursor-pointer">
                <input type="checkbox" name={"div_" + o} defaultChecked={profile.diversityStatus.includes(o)} className="mr-2 accent-brand-600" />{o}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="label">Certifications</label>
          <div className="flex flex-wrap gap-2">
            {certOptions.map(o => (
              <label key={o} className="chip bg-ink-100 dark:bg-ink-800 px-3 py-1.5 cursor-pointer">
                <input type="checkbox" name={"cert_" + o} defaultChecked={profile.certifications.includes(o)} className="mr-2 accent-brand-600" />{o}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          {saved && <div className="text-sm muted mr-4 self-center">{saved}</div>}
          <button className="btn-primary">Save profile</button>
        </div>
      </form>
    </div>
  );
}
