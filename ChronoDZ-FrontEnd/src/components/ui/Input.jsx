export default function Input({
  label,
  hint,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-800">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-2xl border ${
          error ? "border-rose-400" : "border-slate-200"
        } bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-slate-900 ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}