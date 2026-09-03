export type GrantCategory =
  | "Small Business"
  | "Startup"
  | "Nonprofit"
  | "Women-Owned"
  | "Minority-Owned"
  | "Veteran"
  | "Education"
  | "Rural"
  | "Green Energy"
  | "Technology";

export type GrantStatus = "Open" | "Closing Soon" | "New" | "Rolling";

export interface Grant {
  id: string;
  title: string;
  provider: string;
  category: GrantCategory;
  fundingAmount: number;
  fundingRangeLow: number;
  fundingRangeHigh: number;
  deadline: string; // ISO
  eligibility: string[];
  requiredDocuments: string[];
  matchPercentage: number;
  status: GrantStatus;
  overview: string;
  timeline: { label: string; date: string }[];
  faq: { q: string; a: string }[];
  location: string;
  tags: string[];
}

const providers = [
  "U.S. Small Business Administration",
  "U.S. Department of Commerce",
  "National Science Foundation",
  "USDA Rural Development",
  "Department of Energy",
  "Minority Business Development Agency",
  "Amber Grant Foundation",
  "IFundWomen",
  "Comcast RISE",
  "Verizon Small Business Digital Ready",
  "Hello Alice",
  "FedEx Small Business Grant Program",
  "Halstead Grant",
  "National Endowment for the Arts",
  "Department of Veterans Affairs",
  "Kauffman Foundation",
  "MacArthur Foundation",
  "Google.org",
  "Walmart Foundation",
  "Bank of America Neighborhood Builders",
];

const baseGrants: Omit<Grant, "id" | "deadline" | "matchPercentage" | "status" | "timeline" | "faq">[] = [
  {
    title: "SBA Growth Accelerator Grant",
    provider: "U.S. Small Business Administration",
    category: "Small Business",
    fundingAmount: 50000, fundingRangeLow: 25000, fundingRangeHigh: 75000,
    eligibility: ["Registered US small business", "Fewer than 500 employees", "Annual revenue under $10M", "In operation for 12+ months"],
    requiredDocuments: ["Articles of Incorporation", "EIN Letter", "Financial Statements (2 yrs)", "Business Plan"],
    overview: "The SBA Growth Accelerator supports small businesses ready to scale operations, hire talent, or expand into new markets. Funds may be used for equipment, marketing, working capital, and workforce training.",
    location: "Nationwide", tags: ["Growth", "Scaling", "SBA"],
  },
  {
    title: "Women-Owned Business Expansion Grant",
    provider: "IFundWomen", category: "Women-Owned",
    fundingAmount: 25000, fundingRangeLow: 10000, fundingRangeHigh: 25000,
    eligibility: ["51%+ women-owned", "US-based", "For-profit", "Revenue-generating"],
    requiredDocuments: ["Certification of Women-Owned Status", "EIN Letter", "Business Plan", "Financial Statements"],
    overview: "Direct capital and coaching for women-owned businesses expanding operations, launching new product lines, or entering new markets.",
    location: "Nationwide", tags: ["Women", "Expansion"],
  },
  {
    title: "Minority Business Development Grant",
    provider: "Minority Business Development Agency", category: "Minority-Owned",
    fundingAmount: 100000, fundingRangeLow: 50000, fundingRangeHigh: 250000,
    eligibility: ["51%+ minority-owned per MBDA definition", "US-based", "$500K+ annual revenue"],
    requiredDocuments: ["Minority Business Certification", "Articles of Incorporation", "Tax Returns (3 yrs)", "Financial Statements", "Growth Strategy"],
    overview: "Capital and technical assistance for established minority-owned enterprises seeking to enter federal contracts, export markets, or scale operations.",
    location: "Nationwide", tags: ["MBE", "Federal"],
  },
  {
    title: "Rural Business Development Grant",
    provider: "USDA Rural Development", category: "Rural",
    fundingAmount: 500000, fundingRangeLow: 10000, fundingRangeHigh: 500000,
    eligibility: ["Public bodies, nonprofits, or federally recognized tribes", "Serves rural areas (<50K population)"],
    requiredDocuments: ["501(c)(3) Letter or public body proof", "Project Narrative", "Budget", "Community Impact Plan"],
    overview: "Enables funding for training and technical assistance, business incubators, rural transportation improvements, and community economic development.",
    location: "Rural areas", tags: ["Rural", "USDA"],
  },
  {
    title: "Green Energy Innovation Grant",
    provider: "Department of Energy", category: "Green Energy",
    fundingAmount: 250000, fundingRangeLow: 100000, fundingRangeHigh: 1000000,
    eligibility: ["US-based clean energy business", "Prototype or pilot stage", "Under 500 employees"],
    requiredDocuments: ["Technical Proposal", "Team Bios", "Budget Justification", "Letters of Support"],
    overview: "Advances early-stage clean energy technologies including solar, storage, grid modernization, and building efficiency solutions.",
    location: "Nationwide", tags: ["Clean Energy", "R&D"],
  },
  {
    title: "Technology Innovation Grant (SBIR Phase I)",
    provider: "National Science Foundation", category: "Technology",
    fundingAmount: 275000, fundingRangeLow: 275000, fundingRangeHigh: 275000,
    eligibility: ["US small business (majority US-owned)", "R&D team based in US", "Under 500 employees"],
    requiredDocuments: ["Project Pitch", "Technical Volume", "Budget", "Commercialization Plan"],
    overview: "Non-dilutive funding for early-stage, high-risk technology companies with strong commercial potential across deep tech, biotech, and hardware.",
    location: "Nationwide", tags: ["SBIR", "Deep Tech"],
  },
  {
    title: "Veteran Entrepreneurship Grant",
    provider: "Department of Veterans Affairs", category: "Veteran",
    fundingAmount: 40000, fundingRangeLow: 15000, fundingRangeHigh: 60000,
    eligibility: ["51%+ veteran-owned", "Honorable discharge", "US-based business"],
    requiredDocuments: ["DD-214", "VOSB or SDVOSB Certification", "Business Plan", "Financial Statements"],
    overview: "Supports veteran-owned small businesses with capital for growth, hiring, and operational scale-up.",
    location: "Nationwide", tags: ["Veteran", "VOSB"],
  },
  {
    title: "Nonprofit Capacity Building Grant",
    provider: "MacArthur Foundation", category: "Nonprofit",
    fundingAmount: 150000, fundingRangeLow: 50000, fundingRangeHigh: 300000,
    eligibility: ["501(c)(3) status", "Operating budget $250K–$5M", "3+ years of operation"],
    requiredDocuments: ["IRS Determination Letter", "Audited Financials", "Board Roster", "Strategic Plan"],
    overview: "Multi-year support to strengthen internal systems, leadership development, and organizational infrastructure of mission-driven nonprofits.",
    location: "Nationwide", tags: ["501c3", "Capacity"],
  },
  {
    title: "Startup Seed Funding Program",
    provider: "Kauffman Foundation", category: "Startup",
    fundingAmount: 75000, fundingRangeLow: 25000, fundingRangeHigh: 100000,
    eligibility: ["Pre-seed or seed stage startup", "Founded within last 24 months", "US-incorporated"],
    requiredDocuments: ["Pitch Deck", "Cap Table", "Financial Projections", "Founder Bios"],
    overview: "Non-dilutive seed capital and mentorship for high-potential US startups building the next generation of category-defining companies.",
    location: "Nationwide", tags: ["Seed", "Startup"],
  },
  {
    title: "Educational Institution Innovation Grant",
    provider: "Department of Commerce", category: "Education",
    fundingAmount: 200000, fundingRangeLow: 75000, fundingRangeHigh: 500000,
    eligibility: ["Accredited educational institution", "Public or nonprofit", "STEM-focused programs preferred"],
    requiredDocuments: ["Accreditation Proof", "Program Narrative", "Budget", "Outcomes Framework"],
    overview: "Funds curriculum development, workforce training programs, and educational research at accredited US institutions.",
    location: "Nationwide", tags: ["Education", "STEM"],
  },
  {
    title: "Amber Grant for Women",
    provider: "Amber Grant Foundation", category: "Women-Owned",
    fundingAmount: 10000, fundingRangeLow: 10000, fundingRangeHigh: 25000,
    eligibility: ["Women-owned business", "US or Canada based", "For-profit"],
    requiredDocuments: ["Business Description", "Use of Funds", "Website or Social Proof"],
    overview: "Monthly $10,000 award plus year-end $25,000 grand prize for women entrepreneurs across any industry.",
    location: "US + Canada", tags: ["Women", "Monthly"],
  },
  {
    title: "Comcast RISE Small Business Grant",
    provider: "Comcast RISE", category: "Minority-Owned",
    fundingAmount: 5000, fundingRangeLow: 5000, fundingRangeHigh: 10000,
    eligibility: ["BIPOC, women, veteran, LGBTQIA+, or disability-owned", "51%+ owned", "In operation 3+ years"],
    requiredDocuments: ["Certification of Ownership Status", "Business License"],
    overview: "Grants, marketing, technology upgrades, and coaching for underrepresented small business owners across the US.",
    location: "Nationwide", tags: ["BIPOC", "Marketing"],
  },
  {
    title: "FedEx Small Business Grant",
    provider: "FedEx Small Business Grant Program", category: "Small Business",
    fundingAmount: 50000, fundingRangeLow: 20000, fundingRangeHigh: 50000,
    eligibility: ["US-based for-profit", "Fewer than 99 employees", "In operation 6+ months"],
    requiredDocuments: ["Business Story", "Photos or Video", "Financial Snapshot"],
    overview: "Annual grant competition awarding cash and FedEx business services to standout US small businesses.",
    location: "Nationwide", tags: ["Annual", "Marketing"],
  },
  {
    title: "Halstead Jewelry Business Grant",
    provider: "Halstead Grant", category: "Startup",
    fundingAmount: 7500, fundingRangeLow: 7500, fundingRangeHigh: 7500,
    eligibility: ["Silver jewelry designers", "US-based", "In business under 5 years"],
    requiredDocuments: ["Portfolio", "Business Plan", "Financial Projections"],
    overview: "Niche annual grant for emerging silver jewelry designers building sustainable design businesses.",
    location: "Nationwide", tags: ["Design", "Emerging"],
  },
  {
    title: "Arts & Culture Project Grant",
    provider: "National Endowment for the Arts", category: "Nonprofit",
    fundingAmount: 60000, fundingRangeLow: 10000, fundingRangeHigh: 100000,
    eligibility: ["501(c)(3) nonprofit arts org", "3+ years of programming history"],
    requiredDocuments: ["IRS Determination Letter", "Project Narrative", "Programmatic Budget", "Work Samples"],
    overview: "Project-based grants supporting artistic excellence and public engagement across all disciplines.",
    location: "Nationwide", tags: ["Arts", "NEA"],
  },
  {
    title: "Hello Alice Small Business Growth Fund",
    provider: "Hello Alice", category: "Small Business",
    fundingAmount: 25000, fundingRangeLow: 5000, fundingRangeHigh: 25000,
    eligibility: ["US-based", "Small business owner", "Registered account with Hello Alice"],
    requiredDocuments: ["Business Profile", "Use of Funds Statement"],
    overview: "Rolling grant opportunities partnered with corporations to fund growth-stage small businesses.",
    location: "Nationwide", tags: ["Rolling", "Growth"],
  },
  {
    title: "Verizon Small Business Digital Ready Grant",
    provider: "Verizon Small Business Digital Ready", category: "Small Business",
    fundingAmount: 10000, fundingRangeLow: 10000, fundingRangeHigh: 10000,
    eligibility: ["US small business", "Completed 2+ Verizon digital training courses"],
    requiredDocuments: ["Digital Readiness Certificate", "Business Profile"],
    overview: "Quarterly grants combined with free digital skills training for US small business owners.",
    location: "Nationwide", tags: ["Digital", "Training"],
  },
  {
    title: "Google.org Community Impact Grant",
    provider: "Google.org", category: "Nonprofit",
    fundingAmount: 100000, fundingRangeLow: 25000, fundingRangeHigh: 250000,
    eligibility: ["501(c)(3) or fiscally sponsored nonprofit", "Focus on economic opportunity, education, or crisis response"],
    requiredDocuments: ["IRS Determination Letter", "Project Proposal", "Impact Metrics"],
    overview: "Unrestricted and project-based funding for nonprofits driving measurable community impact.",
    location: "Nationwide", tags: ["Impact", "Community"],
  },
  {
    title: "Walmart Foundation Community Grant",
    provider: "Walmart Foundation", category: "Nonprofit",
    fundingAmount: 5000, fundingRangeLow: 250, fundingRangeHigh: 5000,
    eligibility: ["501(c)(3) or accredited school", "Serves the community of the local Walmart facility"],
    requiredDocuments: ["IRS Determination Letter or School Accreditation", "Project Summary"],
    overview: "Local community grants awarded through Walmart and Sam's Club facilities across the US.",
    location: "Nationwide (local)", tags: ["Community", "Local"],
  },
  {
    title: "Bank of America Neighborhood Builders",
    provider: "Bank of America Neighborhood Builders", category: "Nonprofit",
    fundingAmount: 200000, fundingRangeLow: 200000, fundingRangeHigh: 200000,
    eligibility: ["501(c)(3)", "Focus on economic mobility", "Operating budget between $1M and $50M"],
    requiredDocuments: ["IRS Determination Letter", "Audited Financials", "Board Approval Letter"],
    overview: "Two-year unrestricted grant plus leadership development for two nonprofit leaders per organization.",
    location: "Select US metros", tags: ["Leadership", "Multi-year"],
  },
  {
    title: "Rural Broadband Expansion Grant",
    provider: "USDA Rural Development", category: "Rural",
    fundingAmount: 1000000, fundingRangeLow: 250000, fundingRangeHigh: 5000000,
    eligibility: ["Telecom operators or cooperatives", "Serving unserved rural communities"],
    requiredDocuments: ["Service Area Map", "Technical Buildout Plan", "Financial Statements"],
    overview: "Infrastructure funding to bring high-speed broadband to underserved rural communities across the United States.",
    location: "Rural areas", tags: ["Broadband", "Infrastructure"],
  },
  {
    title: "Clean Manufacturing Innovation Grant",
    provider: "Department of Energy", category: "Green Energy",
    fundingAmount: 500000, fundingRangeLow: 200000, fundingRangeHigh: 2000000,
    eligibility: ["US manufacturer", "Emissions reduction focus", "Under 500 employees"],
    requiredDocuments: ["Technical Volume", "Environmental Impact Assessment", "Budget"],
    overview: "Funds process improvements and capital equipment upgrades that reduce industrial emissions.",
    location: "Nationwide", tags: ["Manufacturing", "Emissions"],
  },
  {
    title: "AI Research Small Business Grant",
    provider: "National Science Foundation", category: "Technology",
    fundingAmount: 350000, fundingRangeLow: 250000, fundingRangeHigh: 500000,
    eligibility: ["US small business", "AI/ML core research focus", "PI holds relevant expertise"],
    requiredDocuments: ["Research Proposal", "Team Bios", "Commercialization Path"],
    overview: "Non-dilutive R&D funding for US small businesses developing novel AI systems with commercial applications.",
    location: "Nationwide", tags: ["AI", "R&D"],
  },
  {
    title: "STEM Education Innovation Grant",
    provider: "National Science Foundation", category: "Education",
    fundingAmount: 150000, fundingRangeLow: 50000, fundingRangeHigh: 300000,
    eligibility: ["Accredited K–12 or higher-ed institution", "STEM curriculum focus"],
    requiredDocuments: ["Accreditation", "Curriculum Plan", "Outcomes Framework"],
    overview: "Supports the design and evaluation of innovative STEM curriculum, pedagogy, and out-of-school programs.",
    location: "Nationwide", tags: ["STEM", "K12"],
  },
  {
    title: "Veteran-Owned Small Business Contract Readiness",
    provider: "Department of Veterans Affairs", category: "Veteran",
    fundingAmount: 30000, fundingRangeLow: 10000, fundingRangeHigh: 50000,
    eligibility: ["VOSB or SDVOSB certified", "Federal contract-ready"],
    requiredDocuments: ["VOSB/SDVOSB Certification", "Capabilities Statement", "Past Performance"],
    overview: "Prepares veteran-owned businesses for federal contracting through certification, technical assistance, and capital.",
    location: "Nationwide", tags: ["Federal Contracts", "SDVOSB"],
  },
  {
    title: "Latina Entrepreneur Grant",
    provider: "IFundWomen", category: "Minority-Owned",
    fundingAmount: 15000, fundingRangeLow: 5000, fundingRangeHigh: 15000,
    eligibility: ["Latina-owned (51%+)", "US-based", "For-profit or nonprofit"],
    requiredDocuments: ["Ownership Verification", "Business Overview", "Use of Funds"],
    overview: "Capital and coaching for Latina entrepreneurs scaling their businesses in the United States.",
    location: "Nationwide", tags: ["Latina", "Coaching"],
  },
  {
    title: "Black-Owned Business Growth Grant",
    provider: "Hello Alice", category: "Minority-Owned",
    fundingAmount: 20000, fundingRangeLow: 5000, fundingRangeHigh: 25000,
    eligibility: ["Black-owned (51%+)", "US-based", "Revenue-generating"],
    requiredDocuments: ["Ownership Verification", "Business Snapshot", "Growth Plan"],
    overview: "Growth capital and business support for Black-owned enterprises across all industries.",
    location: "Nationwide", tags: ["BOB", "Growth"],
  },
  {
    title: "Youth Startup Founder Grant",
    provider: "Kauffman Foundation", category: "Startup",
    fundingAmount: 20000, fundingRangeLow: 10000, fundingRangeHigh: 25000,
    eligibility: ["Founder age 18–25", "US-incorporated startup", "Under 24 months old"],
    requiredDocuments: ["Founder ID", "Pitch Deck", "Financial Projections"],
    overview: "Supports the next generation of young founders building venture-scale startups in the US.",
    location: "Nationwide", tags: ["Youth", "Founder"],
  },
  {
    title: "Community College Workforce Grant",
    provider: "Department of Commerce", category: "Education",
    fundingAmount: 400000, fundingRangeLow: 100000, fundingRangeHigh: 1000000,
    eligibility: ["Accredited community college", "Employer partnerships"],
    requiredDocuments: ["Partnership Agreements", "Program Design", "Outcomes Plan"],
    overview: "Funds employer-aligned workforce training programs at accredited US community colleges.",
    location: "Nationwide", tags: ["Workforce", "Community College"],
  },
  {
    title: "Small Manufacturer Modernization Grant",
    provider: "U.S. Small Business Administration", category: "Small Business",
    fundingAmount: 100000, fundingRangeLow: 25000, fundingRangeHigh: 250000,
    eligibility: ["US small manufacturer", "Under 500 employees", "Capex investment planned"],
    requiredDocuments: ["Equipment Quote", "Business Plan", "Financial Statements"],
    overview: "Supports capital equipment, automation, and workforce upskilling investments at US small manufacturers.",
    location: "Nationwide", tags: ["Manufacturing", "Modernization"],
  },
];

const statuses: GrantStatus[] = ["Open", "Closing Soon", "New", "Rolling"];

function daysFromNow(d: number) {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt.toISOString();
}

export const GRANTS: Grant[] = baseGrants.map((g, i) => {
  const daysOut = 14 + ((i * 17) % 120);
  const status: GrantStatus = daysOut < 25 ? "Closing Soon" : i % 7 === 0 ? "New" : i % 5 === 0 ? "Rolling" : "Open";
  const match = 60 + ((i * 13) % 39);
  return {
    ...g,
    id: `grant-${String(i + 1).padStart(3, "0")}`,
    deadline: daysFromNow(daysOut),
    matchPercentage: match,
    status,
    timeline: [
      { label: "Application Opens", date: daysFromNow(-30 + i) },
      { label: "Application Deadline", date: daysFromNow(daysOut) },
      { label: "Review Period", date: daysFromNow(daysOut + 30) },
      { label: "Award Notifications", date: daysFromNow(daysOut + 60) },
      { label: "Funds Disbursed", date: daysFromNow(daysOut + 90) },
    ],
    faq: [
      { q: "Who is eligible to apply?", a: `Applicants must meet the eligibility requirements listed above, including ownership, revenue, and geographic criteria specific to ${g.category} programs.` },
      { q: "Is this grant taxable?", a: "In most cases, grant funds are considered taxable income to the receiving business. Consult a licensed tax professional for guidance specific to your situation." },
      { q: "Can I apply for multiple grants at once?", a: "Yes. Fundbox Grants encourages qualified applicants to pursue multiple opportunities they match with, provided each program's terms allow it." },
      { q: "How long does review take?", a: "Review timelines vary by program. Most decisions are issued within 60–90 days of the application deadline." },
    ],
  };
});

export const CATEGORIES: GrantCategory[] = [
  "Small Business", "Startup", "Nonprofit", "Women-Owned",
  "Minority-Owned", "Veteran", "Education", "Rural",
  "Green Energy", "Technology",
];
