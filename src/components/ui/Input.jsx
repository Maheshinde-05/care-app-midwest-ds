import { clsx } from "clsx";

export function Input({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-mw-ink-400">
            <Icon size={14} />
          </div>
        )}
        <input
          className={clsx("input", Icon && "pl-9", error && "border-mw-danger focus:ring-mw-danger")}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-mw-danger">{error}</p>}
    </div>
  );
}

export function Select({ label, children, className, ...props }) {
  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      {label && <label className="label">{label}</label>}
      <select
        className="input bg-white appearance-none cursor-pointer"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
