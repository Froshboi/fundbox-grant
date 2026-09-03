export interface Article {
  id: string;
  slug: string;
  title: string;
  category: "Grant Writing" | "Funding News" | "Guides" | "Templates" | "Webinars";
  excerpt: string;
  body: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  tags: string[];
}

const authors = [
  "Priya Menon", "James Ortega", "Rachel Silverberg", "Marcus Bell",
  "Amara Okafor", "David Lin", "Sofia Ramirez", "Tomás Weber",
];

const titles: { title: string; category: Article["category"]; excerpt: string }[] = [
  { title: "How to Write a Winning Federal Grant Proposal in 2025", category: "Grant Writing", excerpt: "A field-tested framework for structuring federal proposals reviewers actually want to read." },
  { title: "The SBIR Phase I Timeline: Week-by-Week Playbook", category: "Guides", excerpt: "Every milestone, deliverable, and gotcha across the SBIR Phase I journey." },
  { title: "$5B in New Federal Grant Funding Announced for 2025", category: "Funding News", excerpt: "Newly appropriated federal programs targeting small manufacturers, clean energy, and rural broadband." },
  { title: "Nonprofit Budget Template: A CFO-Approved Starting Point", category: "Templates", excerpt: "Download a ready-to-use nonprofit operating budget template used by finance teams." },
  { title: "Live Webinar: Grant Discovery for Women Founders", category: "Webinars", excerpt: "Join our team and Amber Grant Foundation for an hour of tactical Q&A." },
  { title: "Reading a Notice of Funding Opportunity Like a Reviewer", category: "Grant Writing", excerpt: "Extract the scoring rubric hidden inside every NOFO in under 20 minutes." },
  { title: "The 12-Document Checklist Every Grant Application Needs", category: "Guides", excerpt: "The universal document set to prepare once and reuse across dozens of applications." },
  { title: "USDA Rural Development Announces Expanded Broadband Grants", category: "Funding News", excerpt: "New $1B tranche for unserved communities under 20K population." },
  { title: "Impact Statement Template: Turning Outcomes Into Numbers", category: "Templates", excerpt: "Convert program outcomes into reviewer-ready impact metrics with this template." },
  { title: "Webinar Replay: The AI Grant Matching Deep Dive", category: "Webinars", excerpt: "How our matching model scores your organization against thousands of programs." },
  { title: "Why Most Grant Applications Fail (and How to Not Be One)", category: "Grant Writing", excerpt: "The three failure modes reviewers cite most often, and the fixes for each." },
  { title: "Corporate vs Federal Grants: Which Is Right For You?", category: "Guides", excerpt: "A decision framework for choosing where to focus limited application capacity." },
  { title: "MBDA Expands Business Center Network in 15 New Cities", category: "Funding News", excerpt: "New physical locations offering technical assistance to minority-owned enterprises." },
  { title: "Grant Reporting Template: Quarterly Update Made Simple", category: "Templates", excerpt: "Keep funders happy with a lightweight quarterly reporting cadence." },
  { title: "Live Workshop: Building Your Case for Support in 90 Minutes", category: "Webinars", excerpt: "Craft the emotional and analytical spine of your fundraising pitch." },
  { title: "Sustainability Grants: A Complete 2025 Landscape Map", category: "Guides", excerpt: "Everything from EPA to DOE to corporate sustainability programs, mapped." },
  { title: "The 'Statement of Need' Section: A Line-by-Line Teardown", category: "Grant Writing", excerpt: "See a real statement of need edited by a former program officer." },
  { title: "DOE Announces $2.5B for Small Manufacturer Emissions Reduction", category: "Funding News", excerpt: "Multi-year funding stream opens for US-based small and mid-sized manufacturers." },
  { title: "Board Approval Letter Template", category: "Templates", excerpt: "The exact letter format most foundations expect from applicant nonprofit boards." },
  { title: "On-Demand Webinar: Federal Grants for First-Time Applicants", category: "Webinars", excerpt: "Everything a first-time federal applicant needs, condensed to 45 minutes." },
];

export const ARTICLES: Article[] = titles.map((t, i) => {
  const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const d = new Date();
  d.setDate(d.getDate() - (i * 4 + 2));
  return {
    id: `art-${String(i + 1).padStart(3, "0")}`,
    slug,
    title: t.title,
    category: t.category,
    excerpt: t.excerpt,
    body:
      `## Overview\n\n${t.excerpt}\n\nThis article walks through what applicants and grant managers need to know, drawn from real reviewer feedback and program officer interviews.\n\n## Key Takeaways\n\n- Understand the funder's stated priorities before writing a single word.\n- Anchor the narrative in measurable outcomes, not activities.\n- Every claim should have a defensible source in your organizational data.\n- Reviewers score against a rubric — extract it and align your writing to it.\n\n## Practical Steps\n\n1. Read the funding announcement three times before drafting.\n2. Map each section of the application to a specific scoring criterion.\n3. Draft the budget in parallel with the narrative, not after.\n4. Run a friendly review with someone outside your team.\n5. Submit at least 48 hours before the deadline to avoid portal failures.\n\n## Common Pitfalls\n\nApplicants routinely under-invest in the evaluation and sustainability sections. These are often the highest-weighted sections in federal rubrics. Do not leave them for the final 24 hours.\n\n## Closing Notes\n\nFundbox Grants members can save this playbook to their document vault and reuse the templates across every application they submit.`,
    author: authors[i % authors.length],
    publishedAt: d.toISOString(),
    readMinutes: 4 + (i % 6),
    tags: [t.category],
  };
});
