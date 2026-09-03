import { useEffect, useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Ticket { id: string; subject: string; category: string; status: string; user_id: string; created_at: string }
interface Message { id: string; ticket_id: string; sender_id: string; body: string; attachment_path?: string | null; attachment_name?: string | null; created_at: string }

export default function AdminSupport() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    if (!supabase) return;
    void loadTickets();
  }, []);

  useEffect(() => {
    if (!supabase || !selected) return;
    void loadMessages(selected.id);
    const channel = supabase.channel(`admin-ticket-${selected.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_messages", filter: `ticket_id=eq.${selected.id}` },
        payload => setMessages(current => current.some(message => message.id === payload.new.id) ? current : [...current, payload.new as Message]))
      .subscribe();
    return () => { void supabase?.removeChannel(channel); };
  }, [selected]);

  async function loadTickets() {
    if (!supabase) return;
    const { data, error: queryError } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false });
    if (queryError) setError(queryError.message);
    else setTickets(data ?? []);
  }

  async function loadMessages(ticketId: string) {
    if (!supabase) return;
    const { data, error: queryError } = await supabase.from("support_messages").select("*").eq("ticket_id", ticketId).order("created_at");
    if (queryError) setError(queryError.message);
    else setMessages(data ?? []);
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !user || !selected || !reply.trim()) return;
    let attachmentPath: string | null = null;
    if (attachment) {
      if (attachment.size > 10 * 1024 * 1024) { setError("Attachments must be 10 MB or smaller."); return; }
      attachmentPath = `${selected.user_id}/${crypto.randomUUID()}-${attachment.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from("support-attachments").upload(attachmentPath, attachment, { contentType: attachment.type || undefined });
      if (uploadError) { setError(uploadError.message); return; }
    }
    const { error: insertError } = await supabase.from("support_messages").insert({
      ticket_id: selected.id, sender_id: user.id, body: reply.trim() || (attachment ? `Attached ${attachment.name}` : ""),
      attachment_path: attachmentPath, attachment_name: attachment?.name ?? null,
    });
    if (insertError) { setError(insertError.message); return; }
    await supabase.from("support_tickets").update({ status: "Pending" }).eq("id", selected.id);
    setReply(""); setAttachment(null);
  }

  return (
    <div className="space-y-4">
      <div><h1 className="h3">Support Inbox</h1><p className="muted text-sm">Reply to customer issues and complaints securely.</p></div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!supabase && <div className="card p-5 text-sm">Configure Supabase and run the support SQL migration to enable the admin inbox.</div>}
      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        <div className="card divide-y divide-ink-100 dark:divide-ink-800">
          {tickets.map(ticket => <button key={ticket.id} onClick={() => setSelected(ticket)} className="w-full text-left p-4 hover:bg-ink-50 dark:hover:bg-ink-800">
            <div className="font-medium text-sm">{ticket.subject}</div><div className="text-xs muted mt-1">{ticket.category} · {ticket.status}</div>
          </button>)}
          {tickets.length === 0 && <div className="p-5 text-sm muted">No support tickets yet.</div>}
        </div>
        <div className="card p-4 min-h-[420px] flex flex-col">
          {selected ? <>
            <div className="font-semibold border-b border-ink-100 dark:border-ink-800 pb-3">{selected.subject}</div>
            <div className="flex-1 py-4 space-y-3 overflow-auto">{messages.map(message => <div key={message.id} className={`text-sm ${message.sender_id === user?.id ? "text-right" : ""}`}><span className="inline-block max-w-[80%] rounded-lg bg-ink-100 dark:bg-ink-800 px-3 py-2">{message.body}{message.attachment_name && <div className="mt-1 text-xs underline"><Paperclip className="inline h-3 w-3" /> {message.attachment_name}</div>}</span></div>)}</div>
              <form onSubmit={sendReply} className="flex gap-2 border-t border-ink-100 dark:border-ink-800 pt-3"><label className="btn-outline px-3 cursor-pointer" aria-label="Attach a file"><Paperclip className="h-4 w-4" /><input type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.txt" onChange={e => setAttachment(e.target.files?.[0] ?? null)} /></label><input className="input min-w-0" value={reply} onChange={e => setReply(e.target.value)} placeholder={attachment ? attachment.name : "Reply to customer..."} /><button className="btn-primary"><Send className="h-4 w-4" /></button></form>
          </> : <div className="m-auto text-sm muted">Select a ticket to view the conversation.</div>}
        </div>
      </div>
    </div>
  );
}
