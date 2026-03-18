import { useState } from "react";
import { clsx } from "clsx";
import { CoordinatorLayout } from "./components/Layout";
import { CoordinatorDashboard } from "./pages/coordinator/Dashboard";
import { TaskQueue } from "./pages/coordinator/TaskQueue";
import { CreateCarePlanTemplate } from "./pages/coordinator/CreateCarePlanTemplate";
import { PatientApp } from "./pages/patient/PatientApp";
import { DesignSystem } from "./pages/DesignSystem";

function ModeSwitcher({ mode, onSwitch }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white border border-mw-surface-border rounded-2xl shadow-xl p-3 flex flex-col gap-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-mw-ink-400 text-center px-1">Preview</p>
      <button
        onClick={() => onSwitch("coordinator")}
        className={clsx(
          "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
          mode === "coordinator" ? "bg-mw-primary-600 text-white" : "bg-mw-surface-muted text-mw-ink-600 hover:bg-mw-primary-50 hover:text-mw-primary-700"
        )}
      >
        Coordinator
      </button>
      <button
        onClick={() => onSwitch("patient")}
        className={clsx(
          "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
          mode === "patient" ? "bg-mw-primary-600 text-white" : "bg-mw-surface-muted text-mw-ink-600 hover:bg-mw-primary-100 hover:text-mw-primary-700"
        )}
      >
        Patient App
      </button>
      <button
        onClick={() => onSwitch("design-system")}
        className={clsx(
          "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
          mode === "design-system" ? "bg-indigo-600 text-white" : "bg-mw-surface-muted text-mw-ink-600 hover:bg-indigo-50 hover:text-indigo-700"
        )}
      >
        Design System
      </button>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("coordinator");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [creatingTemplate, setCreatingTemplate] = useState(false);

  if (mode === "patient") {
    return (
      <>
        <PatientApp />
        <ModeSwitcher mode={mode} onSwitch={(m) => { setMode(m); setActiveNav("dashboard"); }} />
      </>
    );
  }

  if (mode === "design-system") {
    return (
      <>
        <DesignSystem />
        <ModeSwitcher mode={mode} onSwitch={(m) => { setMode(m); setActiveNav("dashboard"); }} />
      </>
    );
  }

  let content;
  if (creatingTemplate) {
    content = <CreateCarePlanTemplate onBack={() => setCreatingTemplate(false)} onSave={() => setCreatingTemplate(false)} />;
  } else if (activeNav === "tasks") {
    content = <TaskQueue />;
  } else {
    content = <CoordinatorDashboard onCreateTemplate={() => setCreatingTemplate(true)} />;
  }

  return (
    <>
      <CoordinatorLayout activeNav={activeNav} onNavChange={(id) => { setActiveNav(id); }}>
        {content}
      </CoordinatorLayout>
      <ModeSwitcher mode={mode} onSwitch={(m) => { setMode(m); setActiveNav("dashboard"); }} />
    </>
  );
}
