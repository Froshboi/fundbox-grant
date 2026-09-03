import { useState } from "react";
import { MessageSquare, LifeBuoy, Send, ChevronRight, Mail, Phone } from "lucide-react";

const faqs = [
  { q: "Is Fundbox Grants a lender?", a: "No. Fundbox Grants is a grant discovery and application management platform — not a lender or financial institution." },
  { q: "How does AI matching work?", a: "We score your organization profile against each grant program's stated eligibility, funding priorities, geography, and past awardee patterns to produce a match percentage." },
  { q: "How much does it cost?", a: "Creating an account and browsing the marketplace is free. Premium features for teams and grant administrators are available." },
  { q: "Do you write applications for us?", a: "Our platform provides templates and guidance. Full-service grant writing is available through vetted partner consultants." },
  { q: "What documents should I upload first?", a: "Start with Articles of Incorporation, EIN letter, and the most recent two years of financials — these are required for most programs." },
];

interface Ticket { id: string; subject: string; category: string; status: "Open" | "Pending" | "Resolved"; createdAt: string }

const seedTickets: Ticket[] = [
  { id: "TCK-2214", subject: "Question about document vault storage", category: "Account", status: "Pending", createdAt: new Date(Date.now() - 86400e3).toISOString() },
  { id: "TCK-2211", subject: "Requesting help with SBIR application", category: "Grants", status: "Open", createdAt: new Date(Date.now() - 3 * 86400e3).toISOString() },
  { id: "TCK-2198", subject: "Update to org profile", category: "Account", status: "Resolved", createdAt: new Date(Date.now() - 12 * 86400e3).toISOString() },
];

export default function Support() {
  const [tab, setTab] = useState<"help" | "chat" | "tickets">("help");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hi — I'm the Fundbox Grants assistant. Ask me anything about grants, applications, or your account." },
  ]);
  const [input, setInput] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>(seedTickets);

  function send() {
    if (!input.trim()) return;
    const text = input; setInput("");
    setMessages(m => [...m, { role: "user", text }]);
    setTimeout(() => {
      setMessages(m => [...m, { role: "bot", text: "Thanks — a specialist will follow up within 1 business day. In the meantime, check the Help Center below for related answers." }]);
    }, 700);
  }

  function newTicket(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setTickets(t => [{ id: "TCK-" + Math.floor(2000 + Math.random() * 999), subject: String(fd.get("subject")), category: String(fd.get("category")), status: "Open", createdAt: new Date().toISOString() }, ...t]);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <h1 className="h2">Customer Support</h1>
        <p className="muted mt-2">Live chat, help center, and ticketing — all in one place.</p>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="card p-5 flex items-start gap-3"><LifeBuoy className="h-5 w-5 text-brand-600" /><div><div className="font-semibold">Help Center</div><div className="text-sm muted">Guides, FAQs, and walkthroughs.</div></div></div>
        <div className="card p-5 flex items-start gap-3"><MessageSquare className="h-5 w-5 text-brand-600" /><div><div className="font-semibold">Live Chat</div><div className="text-sm muted">Chat with our support team.</div></div></div>
        <div className="card p-5 flex items-start gap-3"><Mail className="h-5 w-5 text-brand-600" /><div><div className="font-semibold">Ticket System</div><div className="text-sm muted">Track your requests end-to-end.</div></div></div>
      </div>

      <div className="mt-8 border-b border-ink-100 dark:border-ink-800 flex gap-6 text-sm">
        {(["help", "chat", "tickets"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={"py-3 border-b-2 font-medium " + (tab === t ? "border-brand-600 text-brand-700 dark:text-brand-300" : "border-transparent muted")}>
            {t === "help" ? "Help Center" : t === "chat" ? "Live Chat" : "Tickets"}
          </button>
        ))}
      </div>

      {tab === "help" && (
        <div className="mt-6 grid gap-3">
          {faqs.map(f => (
            <details key={f.q} className="card p-5 group">
              <summary className="cursor-pointer font-medium list-none flex justify-between">
                {f.q}<ChevronRight className="h-4 w-4 group-open:rotate-90 transition" />
              </summary>
              <p className="mt-2 text-sm muted">{f.a}</p>
            </details>
          ))}
          <div className="card p-5 text-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <div className="font-semibold">Still need help?</div>
              <div className="muted">Reach us at <a className="link" href="mailto:support@fundboxgrants.com">support@fundboxgrants.com</a></div>
            </div>
            <div className="flex gap-2">
              <a className="btn-outline" href="tel:+18005551234"><Phone className="h-4 w-4" /> 1-800-555-1234</a>
              <button className="btn-primary" onClick={() => setTab("chat")}>Start chat</button>
            </div>
          </div>
        </div>
      )}

      {tab === "chat" && (
        <div className="mt-6 card p-0 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="font-semibold text-sm">Live Chat</div>
            <span className="text-xs muted">· avg response 2 min</span>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-auto">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <div className={"inline-block px-3 py-2 rounded-lg text-sm max-w-[80%] " + (m.role === "user" ? "bg-brand-600 text-white" : "bg-ink-100 dark:bg-ink-800")}>{m.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); send(); }} className="p-3 border-t border-ink-100 dark:border-ink-800 flex gap-2">
            <input className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." />
            <button className="btn-primary"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}

      {tab === "tickets" && (
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 dark:bg-ink-900 text-xs uppercase muted">
                <tr><th className="text-left p-3">Ticket</th><th className="text-left p-3">Subject</th><th className="text-left p-3">Status</th><th className="text-left p-3">Created</th></tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {tickets.map(t => (
                  <tr key={t.id}>
                    <td className="p-3 font-mono text-xs">{t.id}</td>
                    <td className="p-3"><div className="font-medium">{t.subject}</div><div className="text-xs muted">{t.category}</div></td>
                    <td className="p-3"><span className={"chip " + (t.status === "Open" ? "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300" : t.status === "Pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300")}>{t.status}</span></td>
                    <td className="p-3 text-xs muted">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form onSubmit={newTicket} className="card p-5 h-max space-y-3">
            <div className="font-semibold">New ticket</div>
            <div><label className="label">Subject</label><input required name="subject" className="input" /></div>
            <div><label className="label">Category</label>
              <select name="category" className="input">
                <option>Account</option><option>Grants</option><option>Billing</option><option>Technical</option>
              </select>
            </div>
            <div><label className="label">Message</label><textarea name="message" rows={4} className="input" /></div>
            <button className="btn-primary w-full">Submit ticket</button>
          </form>
        </div>
      )}
    </div>
  );
}
