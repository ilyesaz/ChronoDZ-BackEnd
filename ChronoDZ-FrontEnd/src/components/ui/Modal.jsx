import { useEffect } from "react";
import { cx } from "../../utils/helpers.js";
import Button from "./Button.jsx";

export default function Modal({
  open,
  title,
  onClose,
  children,
  wide = false,
  size = "md",
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const maxWidths = {
    sm: "max-w-lg",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw]",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cx(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-4xl bg-white shadow-soft",
          wide ? maxWidths.xl : maxWidths[size]
        )}
      >
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-line bg-white/95 px-6 py-4 backdrop-blur">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Fermer ✕
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}