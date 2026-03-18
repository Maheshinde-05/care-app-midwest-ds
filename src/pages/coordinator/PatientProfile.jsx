import { useState } from "react";
import { clsx } from "clsx";
import {
  ArrowLeft, Phone, MessageSquare, Plus, Stethoscope,
  FlaskConical, Clock, FileText, AlertTriangle, LayoutTemplate,
  Pill, Dumbbell, Utensils, BookOpen, Flag, TrendingUp,
  CheckSquare, CalendarDays, Activity,
} from "lucide-react";
import { StatusBadge, RiskBadge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { CarePlanCard } from "../../components/CarePlanCard";
import { CarePlanActivities } from "../../components/CarePlanActivities";
import { AIInsightCard } from "../../components/AIInsightCard";
import { Button } from "../../components/ui/Button";

// ── Lab status styles ────────────────────────────────────────────────
const LAB_BADGE = {
  high:   "badge-danger",
  low:    "badge-warning",
  border: "badge-neutral",
  normal: "badge-success",
};
const LAB_LABEL = { high: "High", low: "Low", border: "Borderline", normal: "Normal" };

// ── Activity type icons ──────────────────────────────────────────────
const ACTIVITY_TYPE = {
  medicine:  { icon: Pill,         color: "bg-mw-primary-100 text-mw-primary-700" },
  lab:       { icon: FlaskConical, color: "bg-mw-ink-100 text-mw-ink-600"        },
  diet:      { icon: Utensils,     color: "bg-mw-success-light text-mw-success-dark" },
  exercise:  { icon: Dumbbell,     color: "bg-mw-accent-100 text-mw-accent-700"  },
  education: { icon: BookOpen,     color: "bg-mw-ink-100 text-mw-ink-600"        },
  milestone: { icon: Flag,         color: "bg-mw-primary-100 text-mw-primary-600"},
};

const TIMELINE_ICONS = {
  call:        { icon: Phone,         color: "bg-mw-primary-100 text-mw-primary-700" },
  message:     { icon: MessageSquare, color: "bg-mw-ink-100 text-mw-ink-500"         },
  lab:         { icon: FlaskConical,  color: "bg-mw-ink-100 text-mw-ink-500"         },
  alert:       { icon: AlertTriangle, color: "bg-mw-danger-light text-mw-danger"     },
  careplan:    { icon: FileText,      color: "bg-mw-primary-100 text-mw-primary-600" },
  appointment: { icon: Clock,         color: "bg-mw-accent-100 text-mw-accent-700"   },
};

// ── Stat card ────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, iconBg, valueColor }) {
  return (
    <div className="flex-shrink-0 w-[130px] bg-white border border-mw-surface-border rounded-xl p-3.5">
      <div className={clsx("icon-container w-8 h-8 rounded-md mb-2.5", iconBg)}>
        <Icon size={14} />
      </div>
      <div className={clsx("text-xl font-bold leading-none mb-1", valueColor || "text-mw-ink-900")}>{value}</div>
      <div className="text-[10px] font-medium text-mw-ink-400 uppercase tracking-wide leading-none">{label}</div>
      {sub && <div className="text-[10px] text-mw-ink-300 mt-1">{sub}</div>}
    </div>
  );
}

// ── Lab scroll card ──────────────────────────────────────────────────
function LabScrollCard({ lab }) {
  const badge = LAB_BADGE[lab.status] || LAB_BADGE.normal;
  return (
    <div className="flex-shrink-0 w-[110px] bg-white border border-mw-surface-border rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <FlaskConical size={11} className="text-mw-ink-400 flex-shrink-0" />
        <span className="text-[10px] font-semibold text-mw-ink-600 truncate">{lab.name}</span>
      </div>
      <div className="text-base font-bold text-mw-ink-900 leading-none mb-1.5">{lab.result}</div>
      <span className={clsx("badge text-[9px]", badge)}>{LAB_LABEL[lab.status]}</span>
      <div className="text-[9px] text-mw-ink-300 mt-1.5">{lab.date}</div>
    </div>
  );
}

// ── Activity scroll card ─────────────────────────────────────────────
function ActivityScrollCard({ activity }) {
  const cfg = ACTIVITY_TYPE[activity.type] || ACTIVITY_TYPE.milestone;
  const IconComp = cfg.icon;
  const statusColor = {
    upcoming:  "text-mw-ink-400",
    overdue:   "text-mw-danger",
    missed:    "text-mw-warning",
    completed: "text-mw-success",
  }[activity.status] || "text-mw-ink-400";
  return (
    <div className="flex-shrink-0 w-[150px] bg-white border border-mw-surface-border rounded-xl p-3.5">
      <div className={clsx("icon-container w-8 h-8 rounded-lg mb-2.5", cfg.color)}>
        <IconComp size={14} />
      </div>
      <p className="text-xs font-semibold text-mw-ink-900 leading-snug mb-1 line-clamp-2">{activity.name}</p>
      <p className="text-[10px] text-mw-ink-400 mb-2">{activity.dayRange}</p>
      <span className={clsx("text-[10px] font-semibold capitalize", statusColor)}>{activity.status}</span>
    </div>
  );
}

// ── Doctor scroll card ───────────────────────────────────────────────
function DoctorScrollCard({ doc }) {
  return (
    <div className="flex-shrink-0 w-[175px] bg-white border border-mw-surface-border rounded-xl p-3.5">
      <div className="icon-container w-9 h-9 rounded-lg bg-mw-primary-50 text-mw-primary-600 mb-2.5">
        <Stethoscope size={16} />
      </div>
      <div className="text-xs font-semibold text-mw-ink-900 leading-snug">{doc.name}</div>
      <div className="text-[10px] text-mw-ink-500 mt-0.5">{doc.specialty}</div>
      <div className="text-[10px] text-mw-ink-400 truncate mt-0.5">{doc.facility}</div>
      <div className="text-[10px] text-mw-ink-300 mt-2">Last: {doc.lastVisit}</div>
    </div>
  );
}

// ── Horizontal scroll section ────────────────────────────────────────
function ScrollSection({ label, children, onViewAll }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-mw-ink-600 uppercase tracking-wider">{label}</span>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs text-mw-primary-600 hover:underline">
            View all →
          </button>
        )}
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {children}
      </div>
    </div>
  );
}

// ── Lab full row ─────────────────────────────────────────────────────
function LabRow({ lab }) {
  const badge = LAB_BADGE[lab.status] || LAB_BADGE.normal;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-mw-surface-border last:border-0">
      <FlaskConical size={13} className="text-mw-ink-400 flex-shrink-0" />
      <div className="flex-1">
        <span className="text-sm font-medium text-mw-ink-900">{lab.name}</span>
        <span className="text-xs text-mw-ink-400 ml-2">{lab.date}</span>
      </div>
      <span className="text-sm font-semibold text-mw-ink-700">{lab.result}</span>
      <span className={clsx("badge", badge)}>{LAB_LABEL[lab.status]}</span>
    </div>
  );
}

// ── Doctor full row ──────────────────────────────────────────────────
function DoctorRow({ doc }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-mw-surface-border last:border-0">
      <div className="icon-container w-9 h-9 rounded-lg bg-mw-primary-50 text-mw-primary-600 flex-shrink-0">
        <Stethoscope size={16} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-mw-ink-900">{doc.name}</div>
        <div className="text-xs text-mw-ink-400">{doc.specialty} · {doc.facility}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-mw-ink-400">Last visit</div>
        <div className="text-xs font-medium text-mw-ink-700">{doc.lastVisit}</div>
      </div>
    </div>
  );
}

// ── Timeline item ────────────────────────────────────────────────────
function TimelineItem({ event }) {
  const cfg = TIMELINE_ICONS[event.type] || TIMELINE_ICONS.call;
  const IconComp = cfg.icon;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={clsx("icon-container w-8 h-8 rounded-lg flex-shrink-0", cfg.color)}>
          <IconComp size={14} />
        </div>
        <div className="w-px flex-1 bg-mw-surface-border mt-1.5" />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-mw-ink-400">{event.date} · {event.time}</span>
            <p className="text-sm font-medium text-mw-ink-900 mt-0.5">{event.summary}</p>
          </div>
          <span className="text-[10px] text-mw-ink-400 flex-shrink-0 ml-3">{event.author}</span>
        </div>
      </div>
    </div>
  );
}

const TABS = ["Overview", "Care Plan", "Labs", "Doctors", "Timeline"];

export function PatientProfile({ patient, onBack, onCreateTemplate, panelMode = false }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [goals, setGoals] = useState(patient.carePlan.goals);

  function toggleGoal(id) {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  }

  const planWithGoals = { ...patient.carePlan, goals };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-mw-surface-soft">

      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-mw-surface-border px-5 pt-4 pb-0 flex-shrink-0">
        {!panelMode && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-mw-ink-400 hover:text-mw-ink-900 mb-3 transition-colors"
          >
            <ArrowLeft size={13} /> Back to caseload
          </button>
        )}

        <div className="flex items-start gap-4 flex-wrap">
          <Avatar name={patient.name} status={patient.status} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-mw-ink-900 tracking-tight">{patient.name}</h1>
              <StatusBadge status={patient.status} />
              <RiskBadge risk={patient.risk} />
            </div>
            <div className="text-sm text-mw-ink-400 mt-0.5">
              Age {patient.age} · DOB {patient.dob} · {patient.mrn}
            </div>
            <div className="text-sm font-medium text-mw-ink-700 mt-0.5">{patient.condition}</div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-xs text-mw-ink-400">
                Coordinator: <strong className="text-mw-ink-700">{patient.coordinator}</strong>
              </span>
              <span className="text-xs text-mw-ink-400">· {patient.openTasks} open tasks</span>
              <span className="text-xs text-mw-ink-400">
                · Last: <strong className="text-mw-ink-700">{patient.lastContact}</strong>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="primary" size="sm" icon={Phone}>Log Call</Button>
            <Button variant="secondary" size="sm" icon={MessageSquare}>Message</Button>
            <Button variant="secondary" size="sm" icon={Plus}>Add Task</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mt-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-4 py-2.5 text-xs font-semibold border-b-2 transition-all",
                activeTab === tab
                  ? "border-mw-primary-600 text-mw-primary-700"
                  : "border-transparent text-mw-ink-400 hover:text-mw-ink-800"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto p-5">

        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          <div className="space-y-5">

            {/* Stat cards row — horizontal scroll */}
            <ScrollSection label="At a Glance">
              <StatCard
                label="Compliance"
                value={`${patient.compliance}%`}
                sub={patient.compliance >= 70 ? "On track" : "Needs attention"}
                icon={Activity}
                iconBg="bg-mw-primary-100 text-mw-primary-600"
                valueColor={patient.compliance >= 70 ? "text-mw-success" : patient.compliance >= 40 ? "text-mw-warning" : "text-mw-danger"}
              />
              <StatCard
                label="Risk Level"
                value={patient.risk?.charAt(0).toUpperCase() + patient.risk?.slice(1)}
                icon={AlertTriangle}
                iconBg="bg-mw-danger-light text-mw-danger"
                valueColor="text-mw-danger"
              />
              <StatCard
                label="Open Tasks"
                value={patient.openTasks}
                sub="Assigned to you"
                icon={CheckSquare}
                iconBg="bg-mw-accent-100 text-mw-accent-700"
                valueColor={patient.openTasks >= 3 ? "text-mw-warning" : "text-mw-ink-900"}
              />
              <StatCard
                label="Last Contact"
                value={patient.lastContact}
                icon={Phone}
                iconBg="bg-mw-success-light text-mw-success-dark"
              />
              <StatCard
                label="Care Days"
                value={`${patient.carePlan.careDaysCompleted}`}
                sub={`of ${patient.carePlan.careDaysAllotted} days`}
                icon={CalendarDays}
                iconBg="bg-mw-ink-100 text-mw-ink-600"
              />
            </ScrollSection>

            {/* AI Summary */}
            <AIInsightCard
              title="Pre-Call AI Summary"
              insights={[
                { text: patient.aiSummary.trends },
                ...patient.aiSummary.openIssues.map(i => ({ text: i, urgent: true })),
                ...patient.aiSummary.talkingPoints.map(t => ({ text: `Talking point: ${t}` })),
              ]}
            />

            {/* Labs — horizontal scroll cards */}
            <ScrollSection label="Recent Labs" onViewAll={() => setActiveTab("Labs")}>
              {patient.labs.map((lab, i) => <LabScrollCard key={i} lab={lab} />)}
            </ScrollSection>

            {/* Care Plan Activities — horizontal scroll */}
            <ScrollSection label="Active Care Plan" onViewAll={() => setActiveTab("Care Plan")}>
              {patient.carePlan.activities?.map((act, i) => (
                <ActivityScrollCard key={i} activity={act} />
              ))}
            </ScrollSection>

            {/* Care Team — horizontal scroll */}
            <ScrollSection label="Care Team" onViewAll={() => setActiveTab("Doctors")}>
              {patient.doctors.map((doc, i) => <DoctorScrollCard key={i} doc={doc} />)}
            </ScrollSection>

            {/* Contact */}
            <Card variant="default">
              <CardHeader>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-mw-ink-400">Contact</p>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-mw-ink-400 uppercase tracking-wide mb-1">Phone</div>
                    <div className="text-sm font-medium text-mw-ink-900">{patient.phone}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-mw-ink-400 uppercase tracking-wide mb-1">Emergency Contact</div>
                    <div className="text-sm font-medium text-mw-ink-900">{patient.emergencyContact}</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* ── CARE PLAN ── */}
        {activeTab === "Care Plan" && (
          <div className="max-w-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-mw-ink-400">Activities scheduled for this care plan</p>
              <Button variant="secondary" size="sm" icon={LayoutTemplate} onClick={onCreateTemplate}>
                Create Template
              </Button>
            </div>
            {patient.carePlan.activities?.length > 0
              ? <CarePlanActivities plan={patient.carePlan} />
              : <CarePlanCard plan={planWithGoals} onGoalToggle={toggleGoal} compact={false} />
            }
          </div>
        )}

        {/* ── LABS ── */}
        {activeTab === "Labs" && (
          <div className="flex gap-4 items-start">
            <div className="w-64 flex-shrink-0">
              <Card>
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-mw-ink-400">Lab Results</p>
                </CardHeader>
                <CardBody className="pt-0">
                  {patient.labs.map((lab, i) => <LabRow key={i} lab={lab} />)}
                </CardBody>
              </Card>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-mw-ink-400">Imaging</p>
                  <h3 className="text-sm font-bold text-mw-ink-900 mt-1">Chest X-Ray — PA View</h3>
                  <p className="text-xs text-mw-ink-400">Mar 10, 2026 · Radiology Dept</p>
                </CardHeader>
                <CardBody className="pt-0">
                  <img
                    src="/chest-xray.jpeg"
                    alt="Chest X-Ray"
                    className="w-full rounded-lg object-cover border border-mw-surface-border"
                    style={{ maxHeight: 260 }}
                  />
                  <p className="text-xs text-mw-ink-400 mt-2">
                    <span className="font-semibold text-mw-ink-700">Impression:</span> No acute cardiopulmonary process. Heart size normal. Lungs clear bilaterally.
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-mw-ink-400">Cardiac</p>
                  <h3 className="text-sm font-bold text-mw-ink-900 mt-1">12-Lead ECG</h3>
                  <p className="text-xs text-mw-ink-400">Feb 15, 2026 · Cardiology</p>
                </CardHeader>
                <CardBody className="pt-0">
                  <img
                    src="/ecg-12lead.jpg"
                    alt="12-Lead ECG"
                    className="w-full rounded-lg object-cover border border-mw-surface-border"
                    style={{ maxHeight: 220 }}
                  />
                  <p className="text-xs text-mw-ink-400 mt-2">
                    <span className="font-semibold text-mw-ink-700">Interpretation:</span> Normal sinus rhythm. Rate 72 bpm. No ST changes. QTc 420 ms — within normal limits.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* ── DOCTORS ── */}
        {activeTab === "Doctors" && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-mw-ink-400">Care Team</p>
                <h2 className="text-base font-bold text-mw-ink-900 mt-1">Physicians & Specialists</h2>
              </CardHeader>
              <CardBody className="pt-0">
                {patient.doctors.map((doc, i) => <DoctorRow key={i} doc={doc} />)}
              </CardBody>
            </Card>
          </div>
        )}

        {/* ── TIMELINE ── */}
        {activeTab === "Timeline" && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-mw-ink-400">Care Timeline</p>
              </CardHeader>
              <CardBody className="pt-0">
                {patient.timeline.map(event => (
                  <TimelineItem key={event.id} event={event} />
                ))}
              </CardBody>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
