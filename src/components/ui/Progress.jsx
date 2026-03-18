import { clsx } from "clsx";

function getComplianceColor(pct) {
  if (pct >= 70) return "bg-mw-success";
  if (pct >= 40) return "bg-mw-warning";
  return "bg-mw-danger";
}

export function ProgressBar({ value = 0, max = 100, className, color, showLabel = false, size = "md" }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = color || getComplianceColor(pct);
  const heights = { xs: "h-1", sm: "h-1.5", md: "h-2", lg: "h-3" };

  return (
    <div className={clsx("w-full", className)}>
      <div className={clsx("w-full rounded-full bg-mw-surface-border overflow-hidden", heights[size])}>
        <div
          className={clsx("h-full rounded-full transition-all duration-700", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-mw-ink-400">{value} / {max}</span>
          <span className="text-xs font-semibold text-mw-ink-700">{Math.round(pct)}%</span>
        </div>
      )}
    </div>
  );
}

export function CircularProgress({ value = 0, max = 100, size = 64, strokeWidth = 6, label, sublabel }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const stroke = pct >= 70 ? "#10B981" : pct >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E4E4E7" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={stroke} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.7s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {label    && <span className="text-sm font-bold text-mw-ink-900 leading-none">{label}</span>}
        {sublabel && <span className="text-[10px] text-mw-ink-400 leading-none mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}
