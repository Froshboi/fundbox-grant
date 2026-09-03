import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={"flex items-center gap-2 " + className}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">F</span>
      <span className="font-display text-lg font-bold tracking-tight">
        Fundbox <span className="text-brand-600 dark:text-brand-400">Grants</span>
      </span>
    </Link>
  );
}
