import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import {
  ArrowLeft, Send, Sparkles, Plus, Trash2,
  Pill, FlaskConical, Utensils, Dumbbell, BookOpen, Flag, Save,
  User, CalendarRange, Tag, X, Check, FileText, ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

// ── Activity types ───────────────────────────────────────────────────
const ACTIVITY_TYPES = [
  { key: "medicine",  label: "Medicine",  icon: Pill,         color: "bg-mw-primary-100 text-mw-primary-700" },
  { key: "lab",       label: "Lab",       icon: FlaskConical, color: "bg-mw-ink-100 text-mw-ink-600"         },
  { key: "diet",      label: "Diet",      icon: Utensils,     color: "bg-mw-success-light text-mw-success-dark" },
  { key: "exercise",  label: "Exercise",  icon: Dumbbell,     color: "bg-mw-accent-100 text-mw-accent-700"   },
  { key: "education", label: "Education", icon: BookOpen,     color: "bg-mw-ink-100 text-mw-ink-600"         },
  { key: "milestone", label: "Milestone", icon: Flag,         color: "bg-mw-primary-100 text-mw-primary-600" },
];

// ── AI steps ─────────────────────────────────────────────────────────
const STEPS = [
  { key: "condition", label: "Condition"  },
  { key: "ageRange",  label: "Age Range"  },
  { key: "gender",    label: "Gender"     },
  { key: "suggest",   label: "Activities" },
  { key: "refine",    label: "Refine"     },
];

function getStepIndex(stage) {
  const idx = STEPS.findIndex(s => s.key === stage);
  return idx === -1 ? STEPS.length - 1 : idx;
}

// ── Normalize condition ──────────────────────────────────────────────
function normalizeCondition(input) {
  const l = input.toLowerCase();
  if (l.includes("diabetes") || l.includes("diabetic"))      return "Type 2 Diabetes";
  if (l.includes("hypertension") || l.includes("blood pres")) return "Hypertension";
  if (l.includes("heart failure") || l.includes("chf"))       return "Heart Failure";
  if (l.includes("anxiety") || l.includes("depression"))      return "Anxiety Disorder";
  if (l.includes("surgery") || l.includes("post") || l.includes("recovery")) return "Post-Op Recovery";
  return input.trim();
}

// ── Activity presets ─────────────────────────────────────────────────
const CONDITION_ACTIVITIES = {
  "Type 2 Diabetes": [
    { type: "medicine",  name: "Metformin 500mg",           dayRange: "Day 1 – Day 90",  summary: "Once daily · by mouth · before breakfast",         scheduledTime: "8:00 am",  status: "upcoming", notes: "Take with food" },
    { type: "lab",       name: "HbA1c, Fasting Glucose",    dayRange: "Day 1 – Day 90",  summary: "Once in 30 days · fasting required 8 hrs",          scheduledTime: "9:00 am",  status: "upcoming", notes: "Patient must fast" },
    { type: "diet",      name: "Low-carb meal plan",        dayRange: "Day 1 – Day 90",  summary: "Daily · Avoid refined carbs & sugary drinks",        scheduledTime: "12:30 pm", status: "upcoming", notes: "" },
    { type: "exercise",  name: "30-min brisk walk",         dayRange: "Day 1 – Day 90",  summary: "Once daily · Morning or after dinner",               scheduledTime: "7:00 am",  status: "upcoming", notes: "" },
    { type: "education", name: "Diabetes self-management",  dayRange: "Day 1 – Day 30",  summary: "Once a week · 30 days · Community program",          scheduledTime: "10:00 am", status: "upcoming", notes: "Enroll in certified program" },
  ],
  "Hypertension": [
    { type: "medicine",  name: "Amlodipine 5mg",            dayRange: "Day 1 – Day 120", summary: "Once daily · morning · by mouth",                    scheduledTime: "8:00 am",  status: "upcoming", notes: "" },
    { type: "exercise",  name: "Home BP check",             dayRange: "Day 1 – Day 120", summary: "Twice daily · Log readings",                         scheduledTime: "8:00 am",  status: "upcoming", notes: "Alert if > 145/90" },
    { type: "diet",      name: "DASH low-sodium diet",      dayRange: "Day 1 – Day 120", summary: "Daily · <1500mg sodium/day",                         scheduledTime: "12:00 pm", status: "upcoming", notes: "" },
    { type: "lab",       name: "BMP, Lipid Panel, eGFR",    dayRange: "Day 30 – Day 120",summary: "Once in 30 days · from day 30",                      scheduledTime: "9:00 am",  status: "upcoming", notes: "" },
  ],
  "Heart Failure": [
    { type: "exercise",  name: "Daily weight monitoring",   dayRange: "Day 1 – Day 180", summary: "Once daily · every morning before eating",           scheduledTime: "7:00 am",  status: "upcoming", notes: "Alert if > 3 lb gain in 24 hrs" },
    { type: "medicine",  name: "Furosemide 40mg",           dayRange: "Day 1 – Day 180", summary: "Once daily · morning · by mouth",                    scheduledTime: "8:00 am",  status: "upcoming", notes: "Monitor potassium" },
    { type: "diet",      name: "Fluid restriction 2L/day",  dayRange: "Day 1 – Day 180", summary: "Max 2L/day · track all fluid intake",                scheduledTime: "12:00 pm", status: "upcoming", notes: "Include soups, ice, gelatin" },
    { type: "lab",       name: "BNP, BMP, CBC",             dayRange: "Day 30 – Day 180",summary: "Once a month · heart failure markers",               scheduledTime: "9:00 am",  status: "upcoming", notes: "" },
  ],
};

const CONDITION_SUMMARY = {
  "Type 2 Diabetes": "**Metformin 500mg** (daily)\n**HbA1c + Fasting Glucose** (every 30 days)\n**Low-carb meal plan** (daily)\n**30-min walk** (daily)\n**Diabetes education** (weekly, 30 days)",
  "Hypertension":    "**Amlodipine 5mg** (daily)\n**Home BP monitoring** (twice daily)\n**DASH low-sodium diet** (daily)\n**BMP + Lipid Panel** (monthly from day 30)",
  "Heart Failure":   "**Daily weight monitoring**\n**Furosemide 40mg** (daily)\n**Fluid restriction 2L/day**\n**BNP + BMP + CBC** (monthly)",
};

// ── AI step logic ────────────────────────────────────────────────────
function getAIResponse(stage, userInput, ctx) {
  const condition = normalizeCondition(ctx.condition || userInput || "");

  if (stage === "welcome") return {
    text: "Hi! I'm your care plan assistant. I'll help you build a reusable template in a few steps.\n\n**Step 1 of 4** — What condition or diagnosis is this care plan for?",
    nextStage: "condition",
  };
  if (stage === "condition") return {
    text: `Got it — **${condition}**.\n\n**Step 2 of 4** — What's the typical age range for patients on this plan? _(e.g. 45–65 yrs)_`,
    nextStage: "ageRange",
    extracted: { condition, templateName: `${condition} Care Plan` },
  };
  if (stage === "ageRange") return {
    text: `Thanks! **Step 3 of 4** — What's the primary gender for this template?\n\n_(Male / Female / Any)_`,
    nextStage: "gender",
    extracted: { ageRange: userInput.trim() },
  };
  if (stage === "gender") {
    const summary = CONDITION_SUMMARY[ctx.condition] || "a set of evidence-based activities";
    return {
      text: `Perfect. **Step 4 of 4** — Based on clinical guidelines for **${ctx.condition}** (${ctx.ageRange}, ${userInput.trim()}), I recommend:\n\n${summary}\n\nShall I add these to your template?`,
      nextStage: "suggest",
      extracted: { gender: userInput.trim() },
      suggestedActivities: CONDITION_ACTIVITIES[ctx.condition] || [],
    };
  }
  if (stage === "suggest") {
    const yes = /yes|add|ok|sure|go ahead|looks good|great|yeah|yep/i.test(userInput);
    if (yes) return {
      text: "All activities added to your template. You can review and edit each one in the preview panel.\n\nWould you like to adjust any specific activity, add notes, or change the day range?",
      nextStage: "refine",
      action: "addActivities",
    };
    return {
      text: "No problem! Use the **+ Add Activity** button in the preview panel to add activities manually. Ask me anything about dosing, frequency, or clinical guidelines.",
      nextStage: "refine",
    };
  }
  return {
    text: "Your template is looking great! Click **Save Template** when you're ready, or ask me to adjust any activity.",
    nextStage: "refine",
  };
}

// ── Markdown render ──────────────────────────────────────────────────
function renderMarkdown(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part.split("\n").map((line, j) => (
          <span key={`${i}-${j}`}>{line}{j < part.split("\n").length - 1 && <br />}</span>
        ))
  );
}

// ── Message bubble ───────────────────────────────────────────────────
function Message({ role, text }) {
  return (
    <div className={clsx("flex gap-2.5", role === "user" ? "justify-end" : "justify-start")}>
      {role === "ai" && (
        <div className="w-7 h-7 rounded-lg bg-mw-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={12} className="text-white" />
        </div>
      )}
      <div className={role === "ai" ? "chat-bubble-ai" : "chat-bubble-user"}>
        {role === "ai" ? renderMarkdown(text) : text}
      </div>
    </div>
  );
}

// ── Activity picker modal ────────────────────────────────────────────
function ActivityPickerModal({ onAdd, onClose }) {
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [dayRange, setDayRange] = useState("Day 1 – Day 90");
  const [frequency, setFrequency] = useState("Once a day");
  const [notes, setNotes] = useState("");

  function handleAdd() {
    if (!selected || !name.trim()) return;
    onAdd({
      id: `act-${Date.now()}`,
      type: selected,
      name: name.trim(),
      dayRange,
      summary: `${name.trim()} · ${frequency} · ${dayRange}`,
      scheduledTime: "9:00 am",
      status: "upcoming",
      notes: notes.trim(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-mw-surface-border w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-mw-surface-border">
          <h3 className="text-sm font-bold text-mw-ink-900">Add Activity</h3>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-md"><X size={15} /></button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <label className="label">Activity Type</label>
            <div className="grid grid-cols-3 gap-2">
              {ACTIVITY_TYPES.map(t => {
                const IconComp = t.icon;
                return (
                  <button
                    key={t.key}
                    onClick={() => setSelected(t.key)}
                    className={clsx(
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs font-medium transition-all",
                      selected === t.key
                        ? "border-mw-primary-500 bg-mw-primary-50 text-mw-primary-700"
                        : "border-mw-surface-border text-mw-ink-600 hover:border-mw-primary-300"
                    )}
                  >
                    <div className={clsx("w-7 h-7 rounded-md flex items-center justify-center", t.color)}>
                      <IconComp size={13} />
                    </div>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label">Activity Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Metformin 500mg"
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Day Range</label>
              <input value={dayRange} onChange={e => setDayRange(e.target.value)} className="input" placeholder="Day 1 – Day 90" />
            </div>
            <div>
              <label className="label">Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} className="input bg-white">
                {["Once a day","Twice a day","Once a week","3x per week","Once in 30 days","As needed"].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              rows={2} placeholder="Special instructions..."
              className="input resize-none"
            />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleAdd} disabled={!selected || !name.trim()}>
            Add Activity
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Template activity row ────────────────────────────────────────────
function TemplateActivityRow({ activity, onRemove }) {
  const cfg = ACTIVITY_TYPES.find(t => t.key === activity.type) || ACTIVITY_TYPES[0];
  const IconComp = cfg.icon;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-mw-surface-border last:border-0">
      <div className={clsx("icon-container w-8 h-8 rounded-lg flex-shrink-0 mt-0.5", cfg.color)}>
        <IconComp size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-mw-ink-900">{activity.name}</p>
        <p className="text-xs text-mw-ink-400 mt-0.5">{activity.summary}</p>
        {activity.notes && (
          <p className="text-[10px] italic text-mw-ink-400 mt-1 bg-mw-surface-muted px-2 py-1 rounded-md inline-block">
            {activity.notes}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="source-chip">{activity.dayRange}</span>
        <button onClick={() => onRemove(activity.id)} className="btn-ghost p-1 rounded-md text-mw-ink-400 hover:text-mw-danger">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────
export function CreateCarePlanTemplate({ onBack, onSave }) {
  const [messages, setMessages] = useState([]);
  const [stage, setStage] = useState("welcome");
  const [input, setInput] = useState("");
  const [ctx, setCtx] = useState({ condition: "", ageRange: "", gender: "" });
  const [template, setTemplate] = useState({ name: "", ageRange: "", gender: "", tags: [], activities: [] });
  const [tagInput, setTagInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const welcome = getAIResponse("welcome", "", {});
    setMessages([{ role: "ai", text: welcome.text }]);
    setStage(welcome.nextStage);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");

    const newMessages = [...messages, { role: "user", text: msg }];
    setMessages(newMessages);

    const resp = getAIResponse(stage, msg, ctx);
    const newCtx = { ...ctx, ...resp.extracted };

    // Update ctx (carry suggestedActivities forward)
    const updCtx = resp.suggestedActivities
      ? { ...newCtx, suggestedActivities: resp.suggestedActivities }
      : { ...newCtx, suggestedActivities: ctx.suggestedActivities };
    setCtx(updCtx);

    // Update template fields
    const newTemplate = { ...template };
    if (resp.extracted?.templateName) newTemplate.name = resp.extracted.templateName;
    if (resp.extracted?.ageRange)     newTemplate.ageRange = resp.extracted.ageRange;
    if (resp.extracted?.gender)       newTemplate.gender = resp.extracted.gender;
    if (resp.extracted?.condition && !newTemplate.tags.includes(resp.extracted.condition)) {
      newTemplate.tags = [...newTemplate.tags, resp.extracted.condition];
    }
    if (resp.action === "addActivities" && resp.suggestedActivities) {
      newTemplate.activities = resp.suggestedActivities.map((a, i) => ({ ...a, id: `ai-${i}` }));
    }
    setTemplate(newTemplate);
    setStage(resp.nextStage || stage);

    setTimeout(() => {
      if (resp.action === "addActivities" && resp.suggestedActivities) {
        const acts = resp.suggestedActivities.map((a, i) => ({ ...a, id: `ai-${i}` }));
        setTemplate(prev => ({ ...prev, activities: acts }));
      }
      setMessages(prev => [...prev, { role: "ai", text: resp.text }]);
    }, 500);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function addActivity(act) {
    setTemplate(prev => ({ ...prev, activities: [...prev.activities, act] }));
  }
  function removeActivity(id) {
    setTemplate(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== id) }));
  }
  function addTag(t) {
    const tag = t.trim();
    if (tag && !template.tags.includes(tag)) {
      setTemplate(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  }
  function removeTag(tag) {
    setTemplate(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }

  const currentStepIdx = getStepIndex(stage);
  const showQuickReplies = stage === "suggest";

  return (
    <div className="flex flex-col h-full overflow-hidden bg-mw-surface-soft">

      {/* ── Header ── */}
      <div className="bg-white border-b border-mw-surface-border px-5 py-3.5 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-mw-ink-400 hover:text-mw-ink-900 transition-colors"
        >
          <ArrowLeft size={13} /> Back
        </button>
        <h1 className="text-sm font-bold text-mw-ink-900">Create Care Plan Template</h1>
        <Button
          variant="primary" size="sm" icon={Save}
          onClick={() => onSave?.(template)}
          disabled={!template.name}
        >
          Save Template
        </Button>
      </div>

      {/* ── Two-panel body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Chat */}
        <div className="w-full md:w-[42%] flex flex-col border-r border-mw-surface-border overflow-hidden bg-white">

          {/* Step progress bar */}
          <div className="px-4 py-3 border-b border-mw-surface-border">
            <div className="flex items-center gap-1">
              {STEPS.map((step, idx) => {
                const done    = idx < currentStepIdx;
                const active  = idx === currentStepIdx;
                return (
                  <div key={step.key} className="flex items-center gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className={clsx(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                        done   ? "bg-mw-primary-600 text-white"
                               : active ? "bg-mw-primary-100 border-2 border-mw-primary-500 text-mw-primary-700"
                               : "bg-mw-surface-muted border border-mw-surface-border text-mw-ink-400"
                      )}>
                        {done ? <Check size={10} /> : idx + 1}
                      </div>
                      <span className={clsx(
                        "text-[10px] font-medium hidden sm:block",
                        active ? "text-mw-primary-700" : done ? "text-mw-ink-600" : "text-mw-ink-400"
                      )}>
                        {step.label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={clsx(
                        "flex-1 h-px mx-1",
                        done ? "bg-mw-primary-400" : "bg-mw-surface-border"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI label */}
          <div className="px-4 py-2.5 border-b border-mw-surface-border bg-mw-surface-soft flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-mw-primary-600 flex items-center justify-center">
              <Sparkles size={10} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-mw-ink-700">AI Assistant</span>
            <span className="text-[10px] text-mw-ink-400 ml-auto">Powered by CARA AI</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-mw-surface-soft">
            {messages.map((msg, i) => (
              <Message key={i} role={msg.role} text={msg.text} />
            ))}

            {/* Quick replies */}
            {showQuickReplies && (
              <div className="flex gap-2 flex-wrap pl-9">
                {["Yes, add them all", "Let me customize manually"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => sendMessage(opt)}
                    className="px-3 py-1.5 text-xs font-medium border border-mw-primary-300 text-mw-primary-700 rounded-full hover:bg-mw-primary-50 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Source chips (context references) */}
          {ctx.condition && (
            <div className="px-4 py-2 border-t border-mw-surface-border bg-white flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-mw-ink-400">Sources:</span>
              <span className="source-chip"><FileText size={10} /> Clinical Guidelines — {ctx.condition}</span>
              <span className="source-chip"><FileText size={10} /> Care Protocol v2.1</span>
              {ctx.ageRange && <span className="source-chip">Age {ctx.ageRange}</span>}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-mw-surface-border bg-white">
            <div className="chat-input-bar">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message…"
                className="flex-1 focus:outline-none text-sm text-mw-ink-900 placeholder:text-mw-ink-400 bg-transparent"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-lg bg-mw-primary-600 flex items-center justify-center text-white hover:bg-mw-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Template preview */}
        <div className="hidden md:flex flex-col flex-1 overflow-hidden">
          <div className="px-5 py-3 border-b border-mw-surface-border bg-white flex items-center justify-between">
            <span className="text-xs font-semibold text-mw-ink-700">Template Preview</span>
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-1 text-xs font-medium text-mw-primary-600 hover:text-mw-primary-700 transition-colors"
            >
              <Plus size={12} /> Add Activity
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Meta form */}
            <div className="card p-5">
              {/* Name */}
              <div className="mb-4">
                <label className="label">Template Name</label>
                <input
                  value={template.name}
                  onChange={e => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Type 2 Diabetes Care Plan"
                  className="input font-semibold"
                />
              </div>

              {/* Age + Gender */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="label flex items-center gap-1"><CalendarRange size={10} /> Age Range</label>
                  <input
                    value={template.ageRange}
                    onChange={e => setTemplate(prev => ({ ...prev, ageRange: e.target.value }))}
                    placeholder="45 – 65 Yrs"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label flex items-center gap-1"><User size={10} /> Gender</label>
                  <select
                    value={template.gender}
                    onChange={e => setTemplate(prev => ({ ...prev, gender: e.target.value }))}
                    className="input bg-white"
                  >
                    <option value="">Any</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Any</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="label flex items-center gap-1"><Tag size={10} /> Tags / Conditions</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {template.tags.map(tag => (
                    <span key={tag} className="badge badge-primary flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-mw-primary-900"><X size={9} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
                    placeholder="Add tag and press Enter"
                    className="input flex-1"
                  />
                  <Button variant="secondary" size="sm" onClick={() => addTag(tagInput)}>Add</Button>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-mw-surface-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-mw-ink-800">Activities</span>
                  {template.activities.length > 0 && (
                    <span className="badge badge-primary">{template.activities.length}</span>
                  )}
                </div>
                <button
                  onClick={() => setShowPicker(true)}
                  className="flex items-center gap-1 text-xs font-medium text-mw-primary-600 hover:text-mw-primary-700 transition-colors"
                >
                  <Plus size={12} /> Add
                </button>
              </div>

              <div className="px-5">
                {template.activities.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-10 h-10 rounded-xl bg-mw-surface-muted flex items-center justify-center mx-auto mb-3">
                      <Plus size={18} className="text-mw-ink-300" />
                    </div>
                    <p className="text-sm text-mw-ink-400">No activities yet.</p>
                    <p className="text-xs text-mw-ink-300 mt-1">
                      Tell the AI what condition this plan is for.
                    </p>
                  </div>
                ) : (
                  template.activities.map(a => (
                    <TemplateActivityRow key={a.id} activity={a} onRemove={removeActivity} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPicker && (
        <ActivityPickerModal onAdd={addActivity} onClose={() => setShowPicker(false)} />
      )}
    </div>
  );
}
