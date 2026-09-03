export interface SuccessStory {
  id: string;
  organization: string;
  founder: string;
  location: string;
  category: string;
  grantAwarded: string;
  amount: number;
  year: number;
  quote: string;
  story: string;
  outcomes: string[];
}

export const STORIES: SuccessStory[] = [
  {
    id: "s1", organization: "Meridian Robotics", founder: "Elena Vasquez",
    location: "Austin, TX", category: "Technology", grantAwarded: "SBIR Phase I", amount: 275000, year: 2024,
    quote: "Fundbox Grants surfaced the SBIR opportunity our team would have missed, and their document vault cut our submission time in half.",
    story: "Meridian Robotics develops autonomous inspection drones for wind turbine operators. After a 90-day sprint through Fundbox Grants' matching engine, the team secured NSF SBIR Phase I funding and hired their first three engineers.",
    outcomes: ["Hired 3 senior engineers", "Signed pilot with 2 utilities", "Progressed to SBIR Phase II"],
  },
  {
    id: "s2", organization: "The Rooted Kitchen", founder: "Ayana Brooks",
    location: "Detroit, MI", category: "Women-Owned", grantAwarded: "IFundWomen Expansion Grant", amount: 25000, year: 2024,
    quote: "For the first time we could plan a full year of hiring and menu development without wondering if we'd make payroll.",
    story: "The Rooted Kitchen operates a plant-forward community café in Detroit's North End. The IFundWomen grant funded a second location and a job training program for local youth.",
    outcomes: ["Opened second café", "Trained 12 youth apprentices", "Doubled annual revenue"],
  },
  {
    id: "s3", organization: "Sundial Learning", founder: "Marcus Reyes",
    location: "Fresno, CA", category: "Education", grantAwarded: "STEM Education Innovation Grant", amount: 150000, year: 2023,
    quote: "The grant let us build the curriculum we had spent three years drafting in coffee shops.",
    story: "Sundial Learning designs project-based STEM curriculum for Title I middle schools. NSF funding supported a two-year pilot across four school districts.",
    outcomes: ["Deployed to 24 schools", "Reached 3,800 students", "Peer-reviewed outcomes published"],
  },
  {
    id: "s4", organization: "Overwatch Logistics", founder: "Captain David Klein (Ret.)",
    location: "Norfolk, VA", category: "Veteran", grantAwarded: "VOSB Contract Readiness Grant", amount: 40000, year: 2024,
    quote: "Fundbox Grants matched us with the certification pathway that opened federal contracts within a year.",
    story: "Overwatch Logistics is a veteran-owned last-mile delivery company serving federal facilities. The grant funded VOSB certification, capability statement design, and past-performance documentation.",
    outcomes: ["Secured $2.1M in federal contracts", "Grew fleet by 140%", "Hired 18 veterans"],
  },
  {
    id: "s5", organization: "Prairie Community Health", founder: "Dr. Naomi Whitehorse",
    location: "Rapid City, SD", category: "Nonprofit", grantAwarded: "Rural Business Development Grant", amount: 500000, year: 2023,
    quote: "This funding turned three mobile health units into a real regional network.",
    story: "Prairie Community Health provides mobile primary care across rural South Dakota. USDA funding scaled operations from three to eleven counties.",
    outcomes: ["Expanded to 11 counties", "42,000+ patient visits annually", "Hired 22 clinical staff"],
  },
  {
    id: "s6", organization: "Cascade Solar Co-op", founder: "Julian Park",
    location: "Portland, OR", category: "Green Energy", grantAwarded: "Green Energy Innovation Grant", amount: 250000, year: 2024,
    quote: "The team at Fundbox Grants helped us frame our pilot in language DOE reviewers respond to.",
    story: "Cascade Solar Co-op develops community-owned rooftop solar installations. DOE funding supported a pilot in three low-to-moderate income neighborhoods.",
    outcomes: ["Installed 1.4 MW capacity", "Cut member energy bills 38%", "Trained 20 local installers"],
  },
];
