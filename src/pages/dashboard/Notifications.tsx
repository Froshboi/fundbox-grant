import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const { items, markAllRead, markRead } = useNotifications();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h3">Notifications</h1>
          <p className="muted text-sm">Real-time updates on matches, applications, and deadlines.</p>
        </div>
        <button className="btn-outline" onClick={markAllRead}>Mark all as read</button>
      </div>
      <div className="card divide-y divide-ink-100 dark:divide-ink-800">
        {items.map(n => (
          <button key={n.id} onClick={() => markRead(n.id)} className={cn("w-full text-left p-4 hover:bg-ink-50 dark:hover:bg-ink-800 flex gap-3", !n.read && "bg-brand-50/40 dark:bg-brand-600/5")}>
            <div className={cn("h-2 w-2 rounded-full mt-2 shrink-0", !n.read ? "bg-brand-500" : "bg-transparent")} />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm">{n.title}</div>
              <div className="text-sm muted">{n.body}</div>
              <div className="text-xs muted mt-1">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            <span className="chip bg-ink-100 dark:bg-ink-800 text-xs h-max capitalize">{n.type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
