import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="container-page py-12 max-w-3xl">
      <h1 className="h2">{title}</h1>
      <p className="muted text-sm mt-1">Last updated: {updated}</p>
      <div className="prose prose-sm max-w-none mt-8 space-y-5 text-ink-700 dark:text-ink-200 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
