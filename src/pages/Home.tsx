import { Link } from "react-router-dom";
import { ArrowRight, Award, Building2, CheckCircle2, FileText, Search, Sparkles, Users } from "lucide-react";

const trust = [
  { label: "Funding Facilitated", value: "$125M+" },
  { label: "Businesses Served", value: "12,000+" },
  { label: "Active Grant Programs", value: "450+" },
  { label: "Satisfaction Rate", value: "95%" },
];

const steps = [
  { icon: Users, title: "Create your organization profile", body: "Tell us about your business or nonprofit — EIN, industry, revenue, certifications, and diversity status." },
  { icon: Sparkles, title: "Get AI-matched to grants", body: "Our matching engine scores your organization against hundreds of active US grant programs in seconds." },
  { icon: FileText, title: "Apply with your document vault", body: "Reuse your Articles of Incorporation, IRS letters, and financials across every application." },
  { icon: Award, title: "Track every application", body: "Follow status changes, respond to requests, and celebrate approvals in one place." },
];

const audiences = [
  "Small Businesses", "Startups", "Nonprofits", "Women-Owned Businesses",
  "Minority-Owned Businesses", "Veterans", "Educational Organizations", "Rural Enterprises",
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white dark:from-brand-600/10 dark:via-ink-950 dark:to-ink-950" />
        <div className="container-page pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl">
            <div className="chip bg-brand-100 text-brand-800 dark:bg-brand-600/20 dark:text-brand-300 mb-4">
              <CheckCircle2 className="h-3 w-3 mr-1" /> US grants for businesses, startups & nonprofits
            </div>
            <h1 className="h1">
              Helping Businesses <span className="text-brand-600 dark:text-brand-400">Access Funding</span> Opportunities.
            </h1>
            <p className="mt-6 text-lg md:text-xl muted max-w-2xl">
              Discover grants, funding programs, and financial resources tailored to your organization.
              One profile. Hundreds of matched opportunities. A dashboard for every application.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth?mode=signup" className="btn-primary text-base px-5 py-3">
                <Search className="h-4 w-4" /> Start your request
              </Link>
              <Link to="/auth?mode=signup" className="btn-outline text-base px-5 py-3">
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 text-xs muted">No credit card required · Free organization profile</div>
          </div>

          {/* Trust indicators */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {trust.map(t => (
              <div key={t.label} className="card p-5">
                <div className="font-display text-2xl md:text-3xl font-bold text-brand-600 dark:text-brand-400">{t.value}</div>
                <div className="text-xs uppercase tracking-wide muted mt-1">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="container-page py-16">
        <h2 className="h2">Built for the organizations shaping the American economy</h2>
        <p className="muted mt-3 max-w-2xl">Get Funded Grants supports the full spectrum of US applicants — from first-time nonprofit founders to established minority-owned enterprises.</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {audiences.map(a => (
            <span key={a} className="chip bg-ink-100 dark:bg-ink-800 text-ink-800 dark:text-ink-200 px-3 py-1.5">
              <Building2 className="h-3 w-3 mr-1.5" /> {a}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-ink-50 dark:bg-ink-950 border-y border-ink-100 dark:border-ink-800 py-16">
        <div className="container-page">
          <h2 className="h2">A clearer path to funding</h2>
          <p className="muted mt-3 max-w-2xl">Create your profile, upload your documents, and submit a funding request that our team can review directly.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-20">
        <div className="max-w-2xl">
          <h2 className="h2">Grant discovery, without the wild-goose chase</h2>
          <p className="muted mt-3">A modern operating layer for applicants and grant makers — profile once, apply everywhere.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card p-6">
              <div className="h-10 w-10 rounded-lg bg-brand-600 text-white grid place-items-center mb-4">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-xs muted">Step {i + 1}</div>
              <div className="font-semibold mt-1">{s.title}</div>
              <p className="text-sm muted mt-2">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20">
        <div className="rounded-2xl bg-ink-900 dark:bg-brand-700 text-white p-10 md:p-14 relative overflow-hidden">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to fund what you're building?</h2>
            <p className="mt-3 text-white/80">Create a free account, complete your profile, and get matched to opportunities within minutes.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/auth?mode=signup" className="btn bg-white text-ink-900 hover:bg-ink-100">Create free account</Link>
              <Link to="/support" className="btn border border-white/30 text-white hover:bg-white/10">Talk to support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
