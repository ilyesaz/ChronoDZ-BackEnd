export default function StatCard({ title, value, hint, icon, tone = "default" }) {
  const tones = {
    default: "bg-white border-line",
    blue: "bg-sky-50 border-sky-200",
    green: "bg-emerald-50 border-emerald-200",
    amber: "bg-amber-50 border-amber-200",
  };
  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${tones[tone]}`}
    >
      {icon && <div className="mb-3 text-2xl">{icon}</div>}
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}