import { useEffect, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";

interface Doc { id: string; name: string; type: string; size: string; uploadedAt: string }

const requiredDocs = [
  "Articles of Incorporation", "IRS Determination Letter", "Financial Statements",
  "Business Plan", "Tax Returns", "Ownership Certifications",
];

const KEY = "fb-docs";
const seed: Doc[] = [
  { id: "d1", name: "articles_of_incorporation_2019.pdf", type: "Articles of Incorporation", size: "482 KB", uploadedAt: new Date(Date.now() - 40 * 86400e3).toISOString() },
  { id: "d2", name: "ein_letter.pdf", type: "IRS Determination Letter", size: "112 KB", uploadedAt: new Date(Date.now() - 40 * 86400e3).toISOString() },
  { id: "d3", name: "fy2024_financials.xlsx", type: "Financial Statements", size: "1.2 MB", uploadedAt: new Date(Date.now() - 8 * 86400e3).toISOString() },
];

export default function Documents() {
  const [docs, setDocs] = useState<Doc[]>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    return raw ? JSON.parse(raw) : seed;
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(docs)); }, [docs]);

  function upload(type: string, file: File) {
    setDocs(d => [{ id: "d" + Math.random().toString(36).slice(2, 6), name: file.name, type, size: (file.size / 1024).toFixed(0) + " KB", uploadedAt: new Date().toISOString() }, ...d]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h3">Document Vault</h1>
        <p className="muted text-sm">Upload once. Reuse across every application.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {requiredDocs.map(type => {
          const have = docs.filter(d => d.type === type);
          return (
            <div key={type} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{type}</div>
                  <div className="text-xs muted">{have.length} file{have.length === 1 ? "" : "s"} on file</div>
                </div>
                <label className="btn-outline cursor-pointer">
                  <Upload className="h-4 w-4" /> Upload
                  <input type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(type, f); }} />
                </label>
              </div>
              {have.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {have.map(d => (
                    <li key={d.id} className="flex items-center gap-3 text-sm p-2 rounded bg-ink-50 dark:bg-ink-800">
                      <FileText className="h-4 w-4 text-brand-600" />
                      <div className="min-w-0 flex-1 truncate">{d.name}</div>
                      <span className="text-xs muted">{d.size}</span>
                      <button onClick={() => setDocs(x => x.filter(y => y.id !== d.id))} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
