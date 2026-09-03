export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div><h1 className="h3">Platform Settings</h1><p className="muted text-sm">Manage matching, notifications, and integrations.</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5 space-y-3">
          <div className="font-semibold">AI Matching</div>
          <label className="flex items-center justify-between text-sm"><span>Enable AI matching</span><input type="checkbox" defaultChecked className="accent-brand-600" /></label>
          <label className="flex items-center justify-between text-sm"><span>Nightly re-scoring</span><input type="checkbox" defaultChecked className="accent-brand-600" /></label>
          <label className="flex items-center justify-between text-sm"><span>Match confidence threshold</span><input type="number" defaultValue={60} className="input w-20 py-1" /></label>
        </div>
        <div className="card p-5 space-y-3">
          <div className="font-semibold">Notifications</div>
          <label className="flex items-center justify-between text-sm"><span>Email deadline reminders</span><input type="checkbox" defaultChecked className="accent-brand-600" /></label>
          <label className="flex items-center justify-between text-sm"><span>Push notifications (PWA)</span><input type="checkbox" defaultChecked className="accent-brand-600" /></label>
          <label className="flex items-center justify-between text-sm"><span>Weekly digest</span><input type="checkbox" defaultChecked className="accent-brand-600" /></label>
        </div>
        <div className="card p-5 space-y-3">
          <div className="font-semibold">Integrations</div>
          <div className="flex items-center justify-between text-sm"><span>Stripe (payouts)</span><span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">Connected</span></div>
          <div className="flex items-center justify-between text-sm"><span>Postmark (transactional email)</span><span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">Connected</span></div>
          <div className="flex items-center justify-between text-sm"><span>Persona (KYC/verification)</span><span className="chip bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">Sandbox</span></div>
        </div>
        <div className="card p-5 space-y-3">
          <div className="font-semibold">Danger Zone</div>
          <button className="btn bg-red-600 text-white hover:bg-red-700 w-full">Rotate API keys</button>
          <button className="btn-outline w-full">Export platform data</button>
        </div>
      </div>
    </div>
  );
}
