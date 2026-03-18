import { useState } from "react";
import { clsx } from "clsx";
import { Phone, Plus, MessageSquare, ChevronRight, AlertTriangle } from "lucide-react";
import { StatusBadge, RiskBadge } from "./ui/Badge";
import { Avatar } from "./ui/Avatar";
import { ProgressBar } from "./ui/Progress";


export function PatientRow({ patient, onSelect, isSelected }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onSelect(patient)}
      className={clsx(
        "flex items-center gap-4 px-4 py-3.5 border-b border-mw-surface-border cursor-pointer transition-all duration-100",
        isSelected ? "bg-mw-primary-50 border-l-2 border-l-mw-primary-500" : "hover:bg-mw-surface-soft",
      )}
    >
      <Avatar name={patient.name} status={patient.status} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-mw-ink-900 truncate">{patient.name}</span>
          {patient.overdueAlerts > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-mw-danger font-semibold">
              <AlertTriangle size={10} /> {patient.overdueAlerts}
            </span>
          )}
        </div>
        <div className="text-xs text-mw-ink-400 truncate">
          Age {patient.age} · {patient.condition}
        </div>
      </div>

      <div className="hidden sm:block flex-shrink-0">
        <StatusBadge status={patient.status} />
      </div>

      <div className="hidden lg:block flex-shrink-0">
        <RiskBadge risk={patient.risk} />
      </div>

      <div className="hidden lg:flex flex-col items-end gap-1 w-24 flex-shrink-0">
        <span className="text-xs font-semibold text-mw-ink-600">{patient.compliance}%</span>
        <ProgressBar value={patient.compliance} size="xs" className="w-full" />
      </div>

      <div className="hidden md:block flex-shrink-0 text-right">
        <div className="text-xs text-mw-ink-400">Last contact</div>
        <div className="text-xs font-medium text-mw-ink-600">{patient.lastContact}</div>
      </div>

      <div className="hidden sm:flex flex-shrink-0 items-center gap-1">
        <span className={clsx(
          "text-xs font-semibold px-2 py-0.5 rounded-full",
          patient.openTasks > 0 ? "bg-mw-primary-50 text-mw-primary-700" : "bg-mw-surface-muted text-mw-ink-400"
        )}>
          {patient.openTasks} tasks
        </span>
      </div>

      <div className={clsx(
        "flex-shrink-0 flex items-center gap-1 transition-opacity duration-150",
        showActions ? "opacity-100" : "opacity-0"
      )}>
        <button
          className="p-1.5 rounded-lg hover:bg-mw-primary-100 text-mw-primary-600 transition-colors"
          title="Log call"
          onClick={e => { e.stopPropagation(); }}
        >
          <Phone size={14} />
        </button>
        <button
          className="p-1.5 rounded-lg hover:bg-mw-surface-muted text-mw-ink-400 transition-colors"
          title="Send message"
          onClick={e => { e.stopPropagation(); }}
        >
          <MessageSquare size={14} />
        </button>
        <button
          className="p-1.5 rounded-lg hover:bg-mw-surface-muted text-mw-ink-400 transition-colors"
          title="Add task"
          onClick={e => { e.stopPropagation(); }}
        >
          <Plus size={14} />
        </button>
      </div>

      <ChevronRight size={14} className={clsx("flex-shrink-0 text-mw-ink-400 transition-transform", isSelected && "rotate-90")} />
    </div>
  );
}
