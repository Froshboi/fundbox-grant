import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" aria-label="Get Funded Grants home" className={"inline-flex items-center " + className}>
      <span className="inline-flex flex-col bg-brand-600 px-2.5 py-1.5 text-white leading-none">
        <span className="font-display text-[0.82rem] font-extrabold tracking-[-0.06em]">GET-FUNDED</span>
        <span className="mt-1 flex items-center gap-1.5 text-[0.62rem] font-bold tracking-[0.08em]">
          <span className="h-0.5 w-8 bg-current" />
          <span>GRANT</span>
        </span>
      </span>
    </Link>
  );
}
