import { cx } from "../../utils/helpers.js";

const tones = {
  gray:   "bg-slate-100   text-slate-700  border-slate-200",
  green:  "bg-emerald-50  text-emerald-700 border-emerald-200",
  blue:   "bg-sky-50      text-sky-700    border-sky-200",
  amber:  "bg-amber-50    text-amber-700  border-amber-200",
  red:    "bg-rose-50     text-rose-700   border-rose-200",
  purple: "bg-violet-50   text-violet-700 border-violet-200",
};

export default function Badge({ children, tone = "gray", className = "" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}