export default function Textarea({ label, className = "", rows = 4, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-800">{label}</label>
      )}
      <textarea
        rows={rows}
        className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-slate-900 ${className}`}
        {...props}
      />
    </div>
  );
}