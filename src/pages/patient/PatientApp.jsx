import { useState } from "react";
import { clsx } from "clsx";
import {
  Home, ClipboardList, Activity, MessageSquare, User,
  CheckCircle2, Circle, Calendar, Phone, ChevronRight,
  Heart, TrendingUp, Plus
} from "lucide-react";
import { CircularProgress } from "../../components/ui/Progress";
import { Button } from "../../components/ui/Button";

const PATIENT_DATA = {
  name: "Maria Santos",
  coordinator: "Sarah Chen, RN",
  coordinatorPhone: "+1 (555) 800-CARA",
  greeting: "Good morning, Maria",
  carePlan: {
    name: "Diabetes Management Plan",
    compliance: 42,
    careDaysCompleted: 38,
    careDaysAllotted: 90,
    streak: 2,
    todayTasks: [
      { id: "pt1", title: "Take morning glucose reading",    time: "Before breakfast", completed: true  },
      { id: "pt2", title: "Take Metformin 500mg",            time: "With breakfast",   completed: true  },
      { id: "pt3", title: "Log your meals",                  time: "After each meal",  completed: false },
      { id: "pt4", title: "Take evening glucose reading",    time: "Before dinner",    completed: false },
      { id: "pt5", title: "15-min walk",                     time: "After dinner",     completed: false },
    ],
  },
  upcomingAppointments: [
    { id: "ap1", type: "Lab",       date: "Mar 20, 2026", time: "8:00am",  with: "Valley Medical Center",    note: "HbA1c, Fasting Glucose" },
    { id: "ap2", type: "Follow-up", date: "Mar 25, 2026", time: "10:30am", with: "Dr. Anita Ramos",          note: "Diabetes management review" },
  ],
  messages: [
    { id: "m1", from: "Sarah Chen, RN", time: "Today, 9:00am", preview: "Good morning! Reminder: your lab appointment is next Thursday. Don't forget to fast from midnight." },
    { id: "m2", from: "Dr. Anita Ramos", time: "Yesterday",   preview: "Your HbA1c results are in. Please schedule a follow-up so we can discuss next steps." },
  ],
  vitals: [
    { label: "Morning Glucose", value: "184 mg/dL", date: "Today",      status: "caution" },
    { label: "Evening Glucose", value: "—",          date: "Pending",   status: "pending" },
    { label: "Last HbA1c",      value: "9.2%",       date: "Feb 28",    status: "alert"   },
    { label: "Weight",          value: "162 lbs",    date: "Yesterday", status: "stable"  },
  ],
};

const VITAL_STYLE = {
  caution: "border-mw-warning bg-mw-warning-light",
  pending: "border-mw-surface-border bg-white",
  alert:   "border-mw-danger bg-mw-danger-light",
  stable:  "border-mw-success bg-mw-success-light",
};

const TABS = [
  { id: "home",     label: "Home",     icon: Home },
  { id: "careplan", label: "My Plan",  icon: ClipboardList },
  { id: "vitals",   label: "Vitals",   icon: Activity },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "profile",  label: "Profile",  icon: User },
];

function TaskItem({ task, onToggle }) {
  return (
    <div className={clsx(
      "flex items-center gap-3 py-3 border-b border-mw-surface-border last:border-0",
      task.completed && "opacity-60"
    )}>
      <button onClick={() => onToggle(task.id)} className="flex-shrink-0">
        {task.completed
          ? <CheckCircle2 size={22} className="text-mw-success" />
          : <Circle size={22} className="text-mw-ink-300" />
        }
      </button>
      <div className="flex-1">
        <p className={clsx("text-sm font-medium text-mw-ink-900", task.completed && "line-through text-mw-ink-400")}>{task.title}</p>
        <p className="text-xs text-mw-ink-400">{task.time}</p>
      </div>
      {task.completed && <span className="text-xs text-mw-success-dark font-semibold">Done</span>}
    </div>
  );
}

function HomeTab({ data, onToggle }) {
  const completed = data.carePlan.todayTasks.filter(t => t.completed).length;
  const total     = data.carePlan.todayTasks.length;
  const pct       = Math.round((completed / total) * 100);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-br from-mw-primary-600 to-mw-primary-800 rounded-2xl p-5 text-white">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Today</p>
        <h2 className="text-xl font-bold mb-3">{data.greeting}</h2>
        <div className="flex items-center gap-4">
          <CircularProgress value={pct} size={56} strokeWidth={5} label={`${pct}%`} sublabel="today" />
          <div>
            <p className="text-sm font-semibold">{completed}/{total} tasks done</p>
            <p className="text-xs text-white/70 mt-0.5">{data.carePlan.streak} day streak 🔥</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-mw-surface-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-mw-surface-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-mw-ink-900">Today's Tasks</h3>
          <span className="text-xs text-mw-primary-600 font-semibold">{completed}/{total}</span>
        </div>
        <div className="px-4">
          {data.carePlan.todayTasks.map(t => (
            <TaskItem key={t.id} task={t} onToggle={onToggle} />
          ))}
        </div>
      </div>

      {data.upcomingAppointments.slice(0, 1).map(apt => (
        <div key={apt.id} className="bg-white border border-mw-surface-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-mw-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar size={18} className="text-mw-primary-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-mw-primary-600 font-semibold uppercase tracking-wide">{apt.type} · {apt.date}</p>
            <p className="text-sm font-semibold text-mw-ink-900">{apt.with}</p>
            <p className="text-xs text-mw-ink-400">{apt.time} · {apt.note}</p>
          </div>
          <ChevronRight size={16} className="text-mw-ink-400" />
        </div>
      ))}

      {data.messages.slice(0, 1).map(msg => (
        <div key={msg.id} className="bg-mw-primary-50 border border-mw-primary-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-mw-primary-200 flex items-center justify-center text-xs font-bold text-mw-primary-700">SC</div>
            <div>
              <p className="text-xs font-semibold text-mw-primary-700">{msg.from}</p>
              <p className="text-[10px] text-mw-primary-500">{msg.time}</p>
            </div>
          </div>
          <p className="text-sm text-mw-ink-700 leading-relaxed">{msg.preview}</p>
        </div>
      ))}

      <div className="flex gap-3">
        <Button variant="primary" className="flex-1" icon={Phone}>Call Coordinator</Button>
        <Button variant="secondary" className="flex-1" icon={MessageSquare}>Message</Button>
      </div>
    </div>
  );
}

function CarePlanTab({ data, onToggle }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-mw-surface-border rounded-2xl p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-mw-ink-400 mb-2">Active Care Plan</p>
        <h2 className="text-base font-bold text-mw-ink-900 mb-4">{data.carePlan.name}</h2>
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center gap-1">
            <CircularProgress value={data.carePlan.compliance} size={72} strokeWidth={6} label={`${data.carePlan.compliance}%`} sublabel="compliance" />
            <p className="text-xs text-mw-ink-400">Overall</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CircularProgress
              value={data.carePlan.careDaysCompleted}
              max={data.carePlan.careDaysAllotted}
              size={72} strokeWidth={6}
              label={data.carePlan.careDaysCompleted}
              sublabel={`/ ${data.carePlan.careDaysAllotted}`}
            />
            <p className="text-xs text-mw-ink-400">Care Days</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-mw-surface-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-mw-surface-border">
          <h3 className="text-sm font-bold text-mw-ink-900">Today's Plan</h3>
        </div>
        <div className="px-4">
          {data.carePlan.todayTasks.map(t => (
            <TaskItem key={t.id} task={t} onToggle={onToggle} />
          ))}
        </div>
      </div>

      <div className="bg-white border border-mw-surface-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-mw-surface-border">
          <h3 className="text-sm font-bold text-mw-ink-900">Upcoming Appointments</h3>
        </div>
        <div className="px-4 py-2">
          {data.upcomingAppointments.map(apt => (
            <div key={apt.id} className="flex items-center gap-3 py-3 border-b border-mw-surface-border last:border-0">
              <div className="w-9 h-9 rounded-xl bg-mw-primary-50 flex items-center justify-center flex-shrink-0">
                <Calendar size={16} className="text-mw-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-mw-ink-900">{apt.with}</p>
                <p className="text-xs text-mw-ink-400">{apt.date} · {apt.time}</p>
                <p className="text-xs text-mw-primary-600">{apt.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VitalsTab({ data }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {data.vitals.map((v, i) => (
          <div key={i} className={clsx("rounded-2xl border p-4", VITAL_STYLE[v.status] || VITAL_STYLE.pending)}>
            <p className="text-[10px] font-semibold text-mw-ink-400 uppercase tracking-wide mb-1">{v.label}</p>
            <p className="text-xl font-bold text-mw-ink-900">{v.value}</p>
            <p className="text-xs text-mw-ink-400 mt-0.5">{v.date}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-mw-surface-border rounded-2xl p-4 flex gap-3">
        <TrendingUp size={20} className="text-mw-primary-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-mw-ink-900">Your HbA1c</p>
          <p className="text-sm text-mw-ink-600">Your last reading was 9.2%. Your care team is working with you to bring it below 7.5%.</p>
        </div>
      </div>

      <Button variant="primary" icon={Plus}>Log New Reading</Button>
    </div>
  );
}

function MessagesTab({ data }) {
  return (
    <div className="flex flex-col gap-3">
      {data.messages.map(msg => (
        <div key={msg.id} className="bg-white border border-mw-surface-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-mw-primary-100 flex items-center justify-center text-xs font-bold text-mw-primary-700">
              {msg.from.split(",")[0].split(" ").map(n => n[0]).join("").slice(0,2)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-mw-ink-900">{msg.from}</p>
              <p className="text-[10px] text-mw-ink-400">{msg.time}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-mw-primary-500 flex-shrink-0" />
          </div>
          <p className="text-sm text-mw-ink-600 leading-relaxed">{msg.preview}</p>
          <button className="text-xs text-mw-primary-600 font-semibold mt-2">Reply →</button>
        </div>
      ))}
      <Button variant="primary" icon={MessageSquare}>New Message</Button>
    </div>
  );
}

export function PatientApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [tasks, setTasks] = useState(PATIENT_DATA.carePlan.todayTasks);

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  const data = { ...PATIENT_DATA, carePlan: { ...PATIENT_DATA.carePlan, todayTasks: tasks } };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-mw-surface-soft">
      <div className="bg-white px-5 pt-3 pb-2 flex items-center justify-between border-b border-mw-surface-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-mw-primary-500 to-mw-primary-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-sm text-mw-ink-900 tracking-tight">CARA Patient</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-mw-ink-400">
          <Heart size={12} className="text-mw-danger" />
          <span>Maria Santos</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {activeTab === "home"     && <HomeTab     data={data} onToggle={toggleTask} />}
        {activeTab === "careplan" && <CarePlanTab data={data} onToggle={toggleTask} />}
        {activeTab === "vitals"   && <VitalsTab   data={data} />}
        {activeTab === "messages" && <MessagesTab data={data} />}
        {activeTab === "profile"  && (
          <div className="text-center py-16 text-mw-ink-400 text-sm">Profile settings coming soon.</div>
        )}
      </div>

      <nav className="flex-shrink-0 bg-white border-t border-mw-surface-border px-2 py-2 flex items-center justify-around">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-150",
                isActive ? "text-mw-primary-600" : "text-mw-ink-400"
              )}
            >
              <tab.icon size={20} className={isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"} />
              <span className={clsx("text-[10px] font-semibold", isActive ? "text-mw-primary-600" : "text-mw-ink-400")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
