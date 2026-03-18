import { useState } from "react";
import { clsx } from "clsx";
import {
  Pill, FlaskConical, Utensils, Dumbbell, BookOpen, Flag,
  CheckCircle2, Circle, Clock,
} from "lucide-react";
import { ProgressBar, CircularProgress } from "./ui/Progress";

const ACTIVITY_TYPE = {
  medicine:  { icon: Pill,         color: "bg-mw-primary-100 text-mw-primary-700" },
  lab:       { icon: FlaskConical, color: "bg-mw-ink-100 text-mw-ink-600"         },
  diet:      { icon: Utensils,     color: "bg-mw-success-light text-mw-success-dark" },
  exercise:  { icon: Dumbbell,     color: "bg-mw-accent-100 text-mw-accent-700"   },
  education: { icon: BookOpen,     color: "bg-mw-ink-100 text-mw-ink-600"         },
  milestone: { icon: Flag,         color: "bg-mw-primary-100 text-mw-primary-600" },
};

const STATUS_TABS = ["All", "Upcoming", "Overdue", "Missed", "Completed"];

const STATUS_DOT = {
  upcoming:  "bg-mw-primary-400",
  overdue:   "bg-mw-danger",
  missed:    "bg-mw-warning",
  completed: "bg-mw-success",
};

function ActivityRow({ activity, onToggle }) {
  const cfg = ACTIVITY_TYPE[activity.type] || ACTIVITY_TYPE.milestone;
  const IconComp = cfg.icon;
  const done = activity.status === "completed";
  const isOverdue = activity.status === "overdue";

  return (
    <div className={clsx(
      "flex items-start gap-3 py-3.5 border-b border-mw-surface-border last:border-0 hover:bg-mw-surface-soft transition-colors",
      isOverdue && "border-l-2 border-l-mw-danger pl-3",
    )}>
      <div className="w-14 flex-shrink-0 pt-0.5 text-right">
        <span className="text-[10px] text-mw-ink-400 font-medium leading-none">{activity.scheduledTime}</span>
      </div>
      <div className={clsx("icon-container w-8 h-8 rounded-lg flex-shrink-0 mt-0.5", cfg.color)}>
        <IconComp size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className={clsx("text-sm font-semibold text-mw-ink-900 leading-tight", done && "line-through text-mw-ink-400")}>
              {activity.name}
            </p>
            <p className="text-xs text-mw-ink-400 mt-1 leading-relaxed">{activity.summary}</p>
            {activity.notes && (
              <p className="text-[10px] text-mw-ink-400 italic mt-1 bg-mw-surface-muted px-2 py-1 rounded-md inline-block">
                {activity.notes}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="source-chip">{activity.dayRange}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 mt-1">
        <div className={clsx("w-1.5 h-1.5 rounded-full", STATUS_DOT[activity.status] || "bg-mw-ink-300")} />
        <button onClick={() => onToggle(activity.id)}>
          {done
            ? <CheckCircle2 size={16} className="text-mw-success" />
            : <Circle size={16} className="text-mw-ink-300 hover:text-mw-primary-500 transition-colors" />
          }
        </button>
      </div>
    </div>
  );
}

export function CarePlanActivities({ plan }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activities, setActivities] = useState(plan.activities || []);

  function toggleActivity(id) {
    setActivities(prev =>
      prev.map(a => a.id === id ? { ...a, status: a.status === "completed" ? "upcoming" : "completed" } : a)
    );
  }

  const counts = {
    All:       activities.length,
    Upcoming:  activities.filter(a => a.status === "upcoming").length,
    Overdue:   activities.filter(a => a.status === "overdue").length,
    Missed:    activities.filter(a => a.status === "missed").length,
    Completed: activities.filter(a => a.status === "completed").length,
  };

  const filtered = activities.filter(a => activeFilter === "All" || a.status === activeFilter.toLowerCase());
  const completedCount = activities.filter(a => a.status === "completed").length;
  const pct = activities.length > 0 ? Math.round((completedCount / activities.length) * 100) : 0;

  return (
    <div className="card overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-mw-surface-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-mw-ink-400 mb-1">Active Care Plan</p>
            <h3 className="text-base font-bold text-mw-ink-900 leading-snug">{plan.name}</h3>
            <p className="text-xs text-mw-ink-400 mt-0.5">
              Started {plan.startDate} · {plan.coordinator} · {plan.careDaysAllotted} day plan
            </p>
          </div>
          <CircularProgress value={pct} max={100} size={52} strokeWidth={5} label={`${pct}%`} sublabel="done" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-mw-primary-50 border border-mw-primary-100 rounded-lg p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-mw-primary-700 mb-1">Care Days</div>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold text-mw-primary-800">{plan.careDaysCompleted}</span>
              <span className="text-sm text-mw-primary-600 pb-0.5">/ {plan.careDaysAllotted}</span>
            </div>
            <ProgressBar value={plan.careDaysCompleted} max={plan.careDaysAllotted} size="xs" color="bg-mw-primary-500" className="mt-2" />
          </div>
          <div className="card-flat rounded-lg p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-mw-ink-500 mb-1">Compliance</div>
            <div className="text-xl font-bold text-mw-ink-900">{plan.compliance}%</div>
            <ProgressBar value={plan.compliance} size="xs" className="mt-2" />
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 pb-3 border-b border-mw-surface-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-mw-ink-700">Activities</span>
          <span className="badge badge-primary">{activities.length}</span>
        </div>
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={clsx(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-all flex-shrink-0",
                activeFilter === tab
                  ? "bg-mw-primary-600 text-white"
                  : "bg-white text-mw-ink-500 border border-mw-surface-border hover:border-mw-primary-300 hover:text-mw-primary-700"
              )}
            >
              {tab}
              {counts[tab] > 0 && activeFilter !== tab && (
                <span className="ml-1 opacity-60">({counts[tab]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3">
        {filtered.length === 0 ? (
          <div className="py-14 text-center">
            <Clock size={24} className="text-mw-ink-200 mx-auto mb-2" />
            <p className="text-sm text-mw-ink-400">No {activeFilter.toLowerCase()} activities.</p>
          </div>
        ) : (
          filtered.map(a => <ActivityRow key={a.id} activity={a} onToggle={toggleActivity} />)
        )}
      </div>
    </div>
  );
}
