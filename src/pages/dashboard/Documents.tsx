import { useEffect, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Doc { id: string; name: string; type: string; size: string; uploadedAt: string; storagePath?: string }

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
  const { user } = useAuth();
  const storageKey = `${KEY}-${user?.id ?? "anonymous"}`;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [docs, setDocs] = useState<Doc[]>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    return raw ? JSON.parse(raw) : seed;
  });
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(docs)); }, [docs, storageKey]);
  useEffect(() => {
    if (!supabase || !user) return;
    supabase.from("documents").select("id,name,doc_type,size_bytes,uploaded_at,storage_path").eq("user_id", user.id).order("uploaded_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) { setMessage(error.message); return; }
        setDocs((data ?? []).map(row => ({
          id: row.id, name: row.name, type: row.doc_type, size: formatSize(row.size_bytes),
          uploadedAt: row.uploaded_at, storagePath: row.storage_path,
        })));
      });
  }, [user]);

  async function upload(type: string, file: File) {
    setMessage(null);
    if (file.size > 10 * 1024 * 1024) {
      setMessage("Files must be 10 MB or smaller.");
      return;
    }
    setBusy(true);
    try {
      const id = crypto.randomUUID();
      if (supabase && user) {
        const path = `${user.id}/${id}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: false, contentType: file.type || undefined });
        if (error) throw error;
        const { error: metadataError } = await supabase.from("documents").insert({
          id, user_id: user.id, name: file.name, doc_type: type, size_bytes: file.size,
          mime_type: file.type || "application/octet-stream", storage_path: path,
        });
        if (metadataError) {
          await supabase.storage.from("documents").remove([path]);
          throw metadataError;
        }
      }
      setDocs(d => [{ id, name: file.name, type, size: formatSize(file.size), uploadedAt: new Date().toISOString(), storagePath: user && supabase ? `${user.id}/${id}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}` : undefined }, ...d]);
      setMessage(supabase ? "Document uploaded securely." : "Document saved locally. Configure Supabase for cloud storage.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(doc: Doc) {
    setMessage(null);
    if (supabase && user) {
      if (doc.storagePath) {
        const { error } = await supabase.storage.from("documents").remove([doc.storagePath]);
        if (error) { setMessage(error.message); return; }
      }
      const { error } = await supabase.from("documents").delete().eq("id", doc.id).eq("user_id", user.id);
      if (error) { setMessage(error.message); return; }
    }
    setDocs(current => current.filter(item => item.id !== doc.id));
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
                <label className={`btn-outline cursor-pointer ${busy ? "opacity-50 pointer-events-none" : ""}`}>
                  <Upload className="h-4 w-4" /> Upload
                  <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg" className="hidden" disabled={busy} onChange={e => { const f = e.target.files?.[0]; if (f) void upload(type, f); e.currentTarget.value = ""; }} />
                </label>
              </div>
              {have.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {have.map(d => (
                    <li key={d.id} className="flex items-center gap-3 text-sm p-2 rounded bg-ink-50 dark:bg-ink-800">
                      <FileText className="h-4 w-4 text-brand-600" />
                      <div className="min-w-0 flex-1 truncate">{d.name}</div>
                      <span className="text-xs muted">{d.size}</span>
                      <button onClick={() => void remove(d)} className="text-red-600 hover:text-red-700" aria-label={`Delete ${d.name}`}><Trash2 className="h-4 w-4" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      {message && <div className="text-sm rounded-lg bg-ink-100 dark:bg-ink-800 px-4 py-3">{message}</div>}
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
