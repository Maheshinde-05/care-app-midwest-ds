import { useState } from "react";
import { clsx } from "clsx";
import { Plus, CheckSquare, Clock, AlertTriangle, Search } from "lucide-react";
import { TASKS } from "../../data/mockData";
import { TaskRow } from "../../components/TaskRow";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { MetricCard } from "../../components/MetricCard";

const PRIORITY_FILTERS = ["all", "urgent", "high", "normal", "low"];
const STATUS_FILTERS   = ["all", "pending", "completed"];

function isOverdue(dueDate, completed) {
  if (completed) return false;
  const today = new Date(); today.setHours(0,0,0,0);
  return new Date(dueDate) < today;
}

function groupByPatient(tasks) {
  const map = {};
  tasks.forEach(t => {
    if (!map[t.patientId]) map[t.patientId] = { patientName: t.patientName, tasks: [] };
    map[t.patientId].tasks.push(t);
  });
  return Object.values(map);
}

export function TaskQueue() {
  const [tasks, setTasks] = useState(TASKS);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter]     = useState("pending");

  const filtered = tasks.filter(t => {
    const matchSearch   = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.patientName?.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    const matchStatus   = statusFilter === "all" || (statusFilter === "completed" ? t.completed : !t.completed);
    return matchSearch && matchPriority && matchStatus;
  }).sort((a, b) => {
    const order = { urgent: 0, high: 1, normal: 2, low: 3 };
    const overdueA = isOverdue(a.dueDate, a.completed) ? -1 : 0;
    const overdueB = isOverdue(b.dueDate, b.completed) ? -1 : 0;
    if (overdueA !== overdueB) return overdueA - overdueB;
    return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
  });

  function handleComplete(id, done) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: done } : t));
  }

  const groups = groupByPatient(filtered);
  const overdue = tasks.filter(t => isOverdue(t.dueDate, t.completed)).length;
  const total   = tasks.filter(t => !t.completed).length;
  const done    = tasks.filter(t => t.completed).length;

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-mw-ink-400 mb-1">Workflow</p>
          <h1 className="text-2xl font-bold text-mw-ink-900 tracking-tight">My Tasks</h1>
          <p className="text-sm text-mw-ink-400">{total} open · {overdue} overdue · {done} completed</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus}>New Task</Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <MetricCard label="Overdue" value={overdue} variant={overdue > 0 ? "critical" : "default"} icon={AlertTriangle} />
        <MetricCard label="Due Today" value={tasks.filter(t => !t.completed && t.dueDate === "2026-03-16").length} variant="attention" icon={Clock} />
        <MetricCard label="Completed" value={done} variant="stable" icon={CheckSquare} />
      </div>

      <div className="bg-white border border-mw-surface-border rounded-2xl shadow-xs mb-4">
        <div className="px-4 py-4 border-b border-mw-surface-border flex gap-3 flex-wrap">
          <Input
            icon={Search}
            placeholder="Search tasks or patients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[180px]"
          />
        </div>
        <div className="px-4 py-2.5 flex gap-4 border-b border-mw-surface-border flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold uppercase text-mw-ink-400 mr-1">Status</span>
            {STATUS_FILTERS.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={clsx(
                "px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all",
                statusFilter === s ? "bg-mw-primary-600 text-white" : "bg-mw-surface-muted text-mw-ink-600 hover:bg-mw-primary-50 hover:text-mw-primary-700"
              )}>{s}</button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold uppercase text-mw-ink-400 mr-1">Priority</span>
            {PRIORITY_FILTERS.map(p => (
              <button key={p} onClick={() => setPriorityFilter(p)} className={clsx(
                "px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all",
                priorityFilter === p ? "bg-mw-primary-600 text-white" : "bg-mw-surface-muted text-mw-ink-600 hover:bg-mw-primary-50 hover:text-mw-primary-700"
              )}>{p}</button>
            ))}
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="py-16 text-center text-sm text-mw-ink-400">No tasks match your filters.</div>
        ) : (
          groups.map(group => (
            <div key={group.patientName}>
              <div className="px-4 py-2 bg-mw-surface-soft border-b border-mw-surface-border">
                <span className="text-xs font-bold text-mw-ink-700">{group.patientName}</span>
                <span className="text-xs text-mw-ink-400 ml-2">({group.tasks.length} task{group.tasks.length !== 1 ? "s" : ""})</span>
              </div>
              {group.tasks.map(task => (
                <TaskRow key={task.id} task={task} onComplete={handleComplete} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
}
