import { useState } from "react";
import { clsx } from "clsx";
import { CheckCircle2, Circle, Calendar, User, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardBody } from "./ui/Card";
import { ProgressBar, CircularProgress } from "./ui/Progress";

function GoalRow({ goal, onToggle }) {
  return (
    <div className={clsx("flex items-start gap-3 py-3 border-b border-mw-surface-border last:border-0", goal.completed && "opacity-50")}>
      <button onClick={() => onToggle(goal.id)} className="mt-0.5 flex-shrink-0">
        {goal.completed
          ? <CheckCircle2 size={17} className="text-mw-success" />
          : <Circle size={17} className="text-mw-ink-300 hover:text-mw-primary-500 transition-colors" />
        }
      </button>
      <div className="flex-1 min-w-0">
        <p className={clsx("text-sm font-medium text-mw-ink-900", goal.completed && "line-through text-mw-ink-400")}>
          {goal.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-mw-ink-400"><User size={11} /> {goal.owner}</span>
          <span className="flex items-center gap-1 text-xs text-mw-ink-400"><Calendar size={11} /> Due {goal.dueDate}</span>
        </div>
      </div>
      <span className={clsx(
        "badge text-[10px] flex-shrink-0",
        goal.priority === "urgent" ? "badge-danger" :
        goal.priority === "high"   ? "badge-warning" :
        "badge-neutral"
      )}>
        {goal.priority}
      </span>
    </div>
  );
}

export function CarePlanCard({ plan, onGoalToggle, compact = false }) {
  const [expanded, setExpanded] = useState(!compact);
  const completed = plan.goals.filter(g => g.completed).length;
  const total     = plan.goals.length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-mw-ink-400 mb-1">Active Care Plan</p>
            <h3 className="text-base font-bold text-mw-ink-900 leading-snug">{plan.name}</h3>
            <p className="text-xs text-mw-ink-400 mt-0.5">Started {plan.startDate} · {plan.coordinator}</p>
          </div>
          <CircularProgress value={pct} max={100} size={56} strokeWidth={5} label={`${pct}%`} sublabel="done" />
        </div>
      </CardHeader>

      <CardBody className="pt-3">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-mw-primary-50 border border-mw-primary-100 rounded-lg p-3">
            <div className="text-[10px] text-mw-primary-700 font-semibold uppercase tracking-wide mb-1">Care Days</div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-mw-primary-800">{plan.careDaysCompleted}</span>
              <span className="text-sm text-mw-primary-600 pb-0.5">/ {plan.careDaysAllotted}</span>
            </div>
            <ProgressBar value={plan.careDaysCompleted} max={plan.careDaysAllotted} size="xs" color="bg-mw-primary-500" className="mt-2" />
          </div>
          <div className="card-flat rounded-lg p-3">
            <div className="text-[10px] text-mw-ink-500 font-semibold uppercase tracking-wide mb-1">Compliance</div>
            <div className="text-2xl font-bold text-mw-ink-900">{plan.compliance}%</div>
            <ProgressBar value={plan.compliance} size="xs" className="mt-2" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-mw-ink-700">Goals · {completed}/{total} complete</span>
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-xs text-mw-primary-600 font-medium flex items-center gap-0.5 hover:text-mw-primary-700"
            >
              {expanded ? "Collapse" : "Show all"}
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>

          {expanded ? (
            <div className="animate-slide-up">
              {plan.goals.map(g => <GoalRow key={g.id} goal={g} onToggle={onGoalToggle} />)}
            </div>
          ) : (
            <ProgressBar value={completed} max={total} size="sm" color="bg-mw-primary-500" />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
