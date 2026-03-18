/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono:    ["'JetBrains Mono'", "Fira Code", "monospace"],
      },
      colors: {
        // ── MidWest Design System ──────────────────────────────────────
        "mw-ink": {
          50:  "#F7F7F8",
          100: "#EEEFF1",
          200: "#D9DBDF",
          300: "#B5B8C1",
          400: "#8C909C",
          500: "#666B78",
          600: "#4D515C",
          700: "#353840",
          800: "#1E2027",
          900: "#111318",
          950: "#09090B",
        },
        "mw-surface": {
          DEFAULT: "#FFFFFF",
          soft:    "#FAFAFA",
          muted:   "#F4F4F5",
          border:  "#E4E4E7",
        },
        "mw-primary": {
          50:  "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        "mw-accent": {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        "mw-success": { light: "#D1FAE5", DEFAULT: "#10B981", dark: "#065F46" },
        "mw-danger":  { light: "#FEE2E2", DEFAULT: "#EF4444", dark: "#991B1B" },
        "mw-warning": { light: "#FEF3C7", DEFAULT: "#F59E0B", dark: "#92400E" },

        // ── Legacy tokens (kept for backward compat) ───────────────────
        care: {
          50: "#F0FAF6", 100: "#DCFAEE", 200: "#B8F0D8", 300: "#7FDDB6",
          400: "#40C28A", 500: "#2A9872", 600: "#1E7A5A", 700: "#186249",
        },
        cara: {
          bg:         "#FAFAFA",
          surface:    "#FFFFFF",
          surfaceAlt: "#F9FAFB",
          border:     "#E4E4E7",
          muted:      "#F4F4F5",
          text:       "#111318",
          textSub:    "#353840",
          textMute:   "#8C909C",
        },
      },
      boxShadow: {
        "xs":  "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        "sm":  "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "md":  "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
        "lg":  "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)",
        "xl":  "0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.06)",
        "glow-primary": "0 0 0 3px rgb(99 102 241 / 0.2)",
        "focus-care":   "0 0 0 3px rgba(42,152,114,0.25)",
      },
      borderRadius: {
        "xs":   "0.125rem",
        DEFAULT:"0.375rem",
        "md":   "0.5rem",
        "lg":   "0.75rem",
        "xl":   "1rem",
        "2xl":  "1.25rem",
        "3xl":  "1.5rem",
        "4xl":  "2rem",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      animation: {
        "slide-up": "slideUp 0.22s cubic-bezier(0.2,0,0,1)",
        "fade-in":  "fadeIn 0.3s ease-out",
      },
      keyframes: {
        slideUp: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
      },
    },
  },
  plugins: [],
};
