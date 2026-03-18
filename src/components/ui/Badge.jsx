import { clsx } from "clsx";

const STATUS_STYLES = {
  critical:  { dot: "bg-mw-danger",   pill: "bg-mw-danger-light text-mw-danger-dark  border border-mw-danger",   label: "Critical",  weight: "font-bold"    },
  attention: { dot: "bg-mw-warning",  pill: "bg-mw-warning-light text-mw-warning-dark border border-mw-warning",  label: "Attention", weight: "font-semibold" },
  stable:    { dot: "bg-mw-success",  pill: "bg-mw-success-light text-mw-success-dark border border-mw-success",  label: "Stable",    weight: "font-medium"  },
  pending:   { dot: "bg-mw-ink-300",  pill: "bg-white text-mw-ink-500 border border-mw-surface-border",           label: "Pending",   weight: "font-medium"  },
  inactive:  { dot: "bg-mw-ink-200",  pill: "bg-white text-mw-ink-400 border border-mw-surface-border",           label: "Inactive",  weight: "font-normal"  },
};

const RISK_STYLES = {
  critical: "bg-mw-danger-light text-mw-danger-dark border border-mw-danger font-bold",
  high:     "bg-mw-warning-light text-mw-warning-dark border border-mw-warning font-semibold",
  medium:   "bg-white text-mw-ink-600 border border-mw-surface-border",
  low:      "bg-white text-mw-ink-400 border border-mw-surface-border",
};

export function StatusBadge({ status, className }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.inactive;
  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs", s.pill, s.weight, className)}>
      <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", s.dot)} />
      {s.label}
    </span>
  );
}

export function RiskBadge({ risk, className }) {
  const label = risk ? risk.charAt(0).toUpperCase() + risk.slice(1) : "Unknown";
  return (
    <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-full text-xs", RISK_STYLES[risk] || RISK_STYLES.low, className)}>
      {label} Risk
    </span>
  );
}

export function TaskBadge({ priority, className }) {
  const styles = {
    urgent: "bg-mw-danger-light text-mw-danger-dark border border-mw-danger font-bold",
    high:   "bg-mw-warning-light text-mw-warning-dark border border-mw-warning font-semibold",
    normal: "bg-white text-mw-ink-500 border border-mw-surface-border",
    low:    "bg-white text-mw-ink-400 border border-mw-surface-border",
  };
  const labels = { urgent: "Urgent", high: "High", normal: "Normal", low: "Low" };
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-xs", styles[priority] || styles.normal, className)}>
      {labels[priority] || "Normal"}
    </span>
  );
}

export function AlertSeverityBadge({ severity, className }) {
  const styles = {
    critical:      "bg-mw-danger-light text-mw-danger-dark border border-mw-danger font-bold",
    warning:       "bg-mw-warning-light text-mw-warning-dark border border-mw-warning font-semibold",
    informational: "bg-mw-primary-50 text-mw-primary-700 border border-mw-primary-200",
  };
  return (
    <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-full text-xs", styles[severity] || styles.informational, className)}>
      {severity?.charAt(0).toUpperCase() + severity?.slice(1)}
    </span>
  );
}
