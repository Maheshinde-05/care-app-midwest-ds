import { clsx } from "clsx";
import { Sparkles, ThumbsUp, ThumbsDown, RefreshCw, ChevronRight } from "lucide-react";
import { useState } from "react";

export function AIInsightCard({ title, insights, onRefresh, compact = false }) {
  const [feedback, setFeedback] = useState(null);

  return (
    <div className="card overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-mw-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-mw-primary-600 flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-mw-ink-800">{title}</span>
          <span className="badge badge-primary text-[10px]">AI</span>
        </div>
        <button onClick={onRefresh} className="btn-ghost p-1.5 rounded-md text-mw-ink-400">
          <RefreshCw size={12} />
        </button>
      </div>

      <div className="px-5 py-3.5">
        <ul className="space-y-2.5">
          {insights.slice(0, compact ? 3 : insights.length).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-snug text-mw-ink-700">
              <ChevronRight size={13} className="flex-shrink-0 mt-0.5 text-mw-primary-400" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {!compact && (
        <div className="px-5 py-3 flex items-center gap-2 border-t border-mw-surface-border">
          <span className="text-xs text-mw-ink-400 mr-auto">Was this helpful?</span>
          <button
            onClick={() => setFeedback("up")}
            className={clsx("p-1.5 rounded-md transition-colors", feedback === "up" ? "bg-mw-primary-100 text-mw-primary-600" : "btn-ghost text-mw-ink-400")}
          >
            <ThumbsUp size={13} />
          </button>
          <button
            onClick={() => setFeedback("down")}
            className={clsx("p-1.5 rounded-md transition-colors", feedback === "down" ? "bg-mw-ink-100 text-mw-ink-600" : "btn-ghost text-mw-ink-400")}
          >
            <ThumbsDown size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

export function DailyDigestCard({ digest }) {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="icon-container w-9 h-9 rounded-lg bg-mw-primary-100 text-mw-primary-600">
          <Sparkles size={16} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-mw-ink-400">Daily AI Digest</p>
          <p className="text-xs text-mw-ink-400">{digest.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {[
          { label: "Critical",  value: digest.critical,  color: "text-mw-danger"   },
          { label: "Attention", value: digest.attention, color: "text-mw-warning"  },
          { label: "Care Gaps", value: digest.careGaps,  color: "text-mw-ink-700"  },
          { label: "Upcoming",  value: digest.upcoming,  color: "text-mw-primary-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card-flat rounded-lg px-3 py-2.5 text-center">
            <div className={clsx("text-2xl font-bold leading-none", color)}>{value}</div>
            <div className="text-[10px] font-medium mt-1 uppercase tracking-wide text-mw-ink-400">{label}</div>
          </div>
        ))}
      </div>

      <ul className="space-y-1.5">
        {digest.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-mw-ink-700">
            <span className="w-1 h-1 rounded-full bg-mw-primary-400 flex-shrink-0 mt-2" />
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}
