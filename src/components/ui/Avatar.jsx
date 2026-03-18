import { clsx } from "clsx";

const STATUS_RING = {
  critical:  "ring-2 ring-mw-danger",
  attention: "ring-2 ring-mw-warning",
  stable:    "ring-2 ring-mw-success",
  pending:   "ring-1 ring-mw-ink-300",
  inactive:  "ring-1 ring-mw-ink-200",
};

const STATUS_BG = {
  critical:  "bg-mw-danger text-white",
  attention: "bg-mw-warning text-white",
  stable:    "bg-mw-success text-white",
  pending:   "bg-mw-ink-200 text-mw-ink-600",
  inactive:  "bg-mw-ink-100 text-mw-ink-400",
};

const SIZES = {
  xs: "w-7  h-7  text-[10px]",
  sm: "w-9  h-9  text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

function initials(name = "") {
  return name.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase() || "").join("");
}

export function Avatar({ name, status, size = "md", src, className }) {
  return (
    <div className={clsx(
      "rounded-full flex items-center justify-center font-bold flex-shrink-0",
      SIZES[size],
      STATUS_BG[status] || "bg-mw-primary-100 text-mw-primary-700",
      status && STATUS_RING[status],
      className
    )}>
      {src
        ? <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
        : initials(name)
      }
    </div>
  );
}
