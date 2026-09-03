import { LegalPage } from "./LegalPage";
export default function Disclaimer() {
  return (
    <LegalPage title="Disclaimer" updated="January 1, 2026">
      <p>The information on the Fundbox Grants platform is provided for general informational purposes only. Fundbox Grants Ltd is not a lender, financial institution, tax advisor, or legal counsel. Nothing on the Platform constitutes financial, tax, or legal advice.</p>
      <h2>No Guarantee of Funding</h2>
      <p>Grant approval is at the sole discretion of the third-party funder. Match percentages, eligibility flags, and recommendations are estimates based on available data and are not guarantees of eligibility or award.</p>
      <h2>Third-Party Programs</h2>
      <p>Grant program details on the Platform are aggregated from public sources and funder disclosures. Program terms may change without notice. Always verify current terms with the funder before applying.</p>
      <h2>Not a Financial Institution</h2>
      <p>Fundbox Grants does not disburse funds directly to applicants unless expressly agreed with a specific funder through a written services agreement. Where fund administration services are offered, applicable AML/KYC procedures will apply.</p>
      <h2>Consult Professionals</h2>
      <p>You should consult qualified professionals (attorneys, accountants, licensed advisors) for advice specific to your situation.</p>
    </LegalPage>
  );
}
