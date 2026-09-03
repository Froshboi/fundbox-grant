import type { Grant } from "@/data/grants";
import type { OrgProfile } from "@/contexts/AuthContext";

export interface GrantMatch {
  grant: Grant;
  score: number;
  reasons: string[];
}

export function rankGrantMatches(grants: Grant[], profile: OrgProfile): GrantMatch[] {
  const profileText = [
    profile.industry, profile.entityType, profile.stateOfIncorporation,
    profile.mission, ...profile.diversityStatus, ...profile.certifications,
  ].join(" ").toLowerCase();

  return grants.map(grant => {
    const searchable = [grant.category, grant.location, grant.overview, ...grant.tags, ...grant.eligibility]
      .join(" ").toLowerCase();
    const terms = new Set(profileText.split(/[^a-z0-9]+/).filter(term => term.length > 2));
    const matchedTerms = [...terms].filter(term => searchable.includes(term));
    const categoryMatch = profileText.includes(grant.category.toLowerCase().replace("-", " ")) ||
      grant.tags.some(tag => profileText.includes(tag.toLowerCase()));
    const completenessBoost = Math.round(Math.min(profileCompletion(profile), 100) * 0.08);
    const score = Math.min(99, Math.max(35, 48 + matchedTerms.length * 5 + (categoryMatch ? 17 : 0) + completenessBoost));
    const reasons = [
      ...(categoryMatch ? [`Your profile aligns with ${grant.category.toLowerCase()} eligibility.`] : []),
      ...(matchedTerms.slice(0, 2).map(term => `Your profile mentions ${term}.`)),
      ...(profile.stateOfIncorporation && grant.location.toLowerCase().includes(profile.stateOfIncorporation.toLowerCase())
        ? [`This program covers ${profile.stateOfIncorporation}.`] : []),
    ];
    return { grant, score, reasons: reasons.length ? reasons : ["This opportunity is broadly available to organizations like yours."] };
  }).sort((a, b) => b.score - a.score);
}

function profileCompletion(profile: OrgProfile): number {
  const values = [
    profile.legalName, profile.ein, profile.industry, profile.annualRevenue,
    profile.employeeCount, profile.stateOfIncorporation, profile.entityType,
    profile.yearFounded, profile.website, profile.mission,
  ];
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}
