import { useState } from "react";
import { clsx } from "clsx";
import { Search, Plus, Users, AlertTriangle, Activity } from "lucide-react";
import { PATIENTS } from "../../data/mockData";
import { Avatar } from "../../components/ui/Avatar";
import { ProgressBar } from "../../components/ui/Progress";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { PatientProfile } from "./PatientProfile";

// Status config
const STATUS_CFG = {
  critical:  { dot: "bg-mw-danger",   label: "Critical",  order: 0 },
  attention: { dot: "bg-mw-warning",  label: "Attention", order: 1 },
  pending:   { dot: "bg-mw-ink-400",  label: "Pending",   order: 2 },
  stable:    { dot: "bg-mw-success",  label: "Stable",    order: 3 },
  inactive:  { dot: "bg-mw-ink-200",  label: "Inactive",  order: 4 },
};

const STATUS_CARD_SELECTED = {
  critical:  "border-mw-danger   bg-mw-danger-light/40",
  attention: "border-mw-warning  bg-mw-warning-light/40",
  stable:    "border-mw-success  bg-mw-success-light/40",
  pending:   "border-mw-ink-300  bg-mw-surface-muted",
  inactive:  "border-mw-ink-200  bg-mw-surface-muted",
};

// ── Patient mini-card for horizontal scroll ─────────────────────────
function PatientMiniCard({ patient, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(patient)}
      className={clsx(
        "flex-shrink-0 w-[210px] p-3.5 rounded-xl border text-left transition-all duration-150 group",
        selected
          ? STATUS_CARD_SELECTED[patient.status] || "border-mw-primary-400 bg-mw-primary-50"
          : "border-mw-surface-border bg-white hover:border-mw-primary-300 hover:shadow-sm"
      )}
    >
      {/* Name + status */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar name={patient.name} status={patient.status} size="xs" />
        <div className="flex-1 min-w-0">
          <div className={clsx(
            "text-xs font-semibold truncate leading-tight",
            selected ? "text-mw-ink-900" : "text-mw-ink-800 group-hover:text-mw-ink-900"
          )}>
            {patient.name}
          </div>
          <div className="text-[10px] text-mw-ink-400 truncate">{patient.condition}</div>
        </div>
      </div>

      {/* Compliance bar */}
      <div className="mb-2.5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-medium text-mw-ink-400 uppercase tracking-wide">Compliance</span>
          <span className="text-[10px] font-bold text-mw-ink-700">{patient.compliance}%</span>
        </div>
        <ProgressBar value={patient.compliance} size="xs" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-mw-ink-400">{patient.lastContact}</span>
        {patient.openTasks > 0 && (
          <span className="text-[9px] font-semibold text-mw-primary-700 bg-mw-primary-100 px-1.5 py-0.5 rounded-full">
            {patient.openTasks} tasks
          </span>
        )}
      </div>
    </button>
  );
}

// ── Category row with horizontal scroll ────────────────────────────
function PatientCategoryRow({ statusKey, patients, selectedId, onSelect }) {
  const cfg = STATUS_CFG[statusKey];
  if (!patients.length) return null;

  return (
    <div className="mb-1">
      <div className="flex items-center gap-2 px-4 py-2">
        <div className={clsx("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-mw-ink-400">
          {cfg.label} · {patients.length}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
        {patients.map(p => (
          <PatientMiniCard
            key={p.id}
            patient={p}
            selected={selectedId === p.id}
            onClick={onSelect}
          />
        ))}
        {/* Spacer to indicate more content */}
        <div className="w-4 flex-shrink-0" />
      </div>
    </div>
  );
}

// ── Empty right-panel state ─────────────────────────────────────────
function EmptyDetailState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-mw-surface-soft">
      <div className="text-center max-w-xs">
        <div className="w-14 h-14 rounded-2xl bg-white border border-mw-surface-border shadow-xs flex items-center justify-center mx-auto mb-4">
          <Users size={22} className="text-mw-ink-300" />
        </div>
        <h3 className="text-sm font-semibold text-mw-ink-800 mb-1">Select a patient</h3>
        <p className="text-xs text-mw-ink-400 leading-relaxed">
          Choose a patient from the list to view their profile, care plan, labs, and more.
        </p>
      </div>
    </div>
  );
}

// ── Main dashboard ──────────────────────────────────────────────────
export function CoordinatorDashboard({ onCreateTemplate }) {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filtered = PATIENTS.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.condition.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q)
    );
  });

  // Group by status, in order
  const grouped = Object.entries(STATUS_CFG)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key]) => ({
      key,
      patients: filtered.filter(p => p.status === key),
    }))
    .filter(g => g.patients.length > 0);

  const criticalCount = PATIENTS.filter(p => p.status === "critical").length;
  const attentionCount = PATIENTS.filter(p => p.status === "attention").length;

  return (
    <div className="flex flex-1 overflow-hidden">

      {/* ── LEFT: Categorized patient list ── */}
      <div className="w-[320px] flex-shrink-0 border-r border-mw-surface-border flex flex-col overflow-hidden bg-white">

        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-mw-surface-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-mw-ink-900">Caseload</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-mw-ink-400">{PATIENTS.length} patients</span>
                {criticalCount > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-mw-danger">
                    <AlertTriangle size={10} /> {criticalCount} critical
                  </span>
                )}
              </div>
            </div>
            <Button variant="primary" size="xs" icon={Plus}>New</Button>
          </div>

          <Input
            icon={Search}
            placeholder="Search patients, MRN…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-px bg-mw-surface-border border-b border-mw-surface-border">
          <div className="bg-white px-4 py-2.5">
            <div className="text-[10px] text-mw-ink-400 font-medium uppercase tracking-wide">Critical</div>
            <div className="text-lg font-bold text-mw-danger leading-tight">{criticalCount}</div>
          </div>
          <div className="bg-white px-4 py-2.5">
            <div className="text-[10px] text-mw-ink-400 font-medium uppercase tracking-wide">Attention</div>
            <div className="text-lg font-bold text-mw-warning leading-tight">{attentionCount}</div>
          </div>
        </div>

        {/* Scrollable categorized list */}
        <div className="flex-1 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="py-14 text-center px-4">
              <Activity size={24} className="text-mw-ink-200 mx-auto mb-3" />
              <p className="text-sm text-mw-ink-400">No patients match.</p>
              <button
                onClick={() => setSearch("")}
                className="text-xs text-mw-primary-600 mt-2 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            grouped.map(g => (
              <PatientCategoryRow
                key={g.key}
                statusKey={g.key}
                patients={g.patients}
                selectedId={selectedPatient?.id}
                onSelect={setSelectedPatient}
              />
            ))
          )}
        </div>
      </div>

      {/* ── RIGHT: Patient detail ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {selectedPatient
          ? <PatientProfile
              patient={selectedPatient}
              panelMode
              onCreateTemplate={onCreateTemplate}
            />
          : <EmptyDetailState />
        }
      </div>

    </div>
  );
}
