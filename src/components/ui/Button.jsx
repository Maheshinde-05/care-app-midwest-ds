import { clsx } from "clsx";

const VARIANTS = {
  primary:   "btn-primary",
  secondary: "btn-secondary",
  ghost:     "btn-ghost",
  dark:      "btn-dark",
  danger:    "btn-danger",
  care:      "btn-primary",
  outline:   "btn-secondary",
};

const SIZES = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export function Button({ variant = "primary", size = "md", children, className, icon: Icon, iconRight: IconRight, ...props }) {
  return (
    <button
      className={clsx("btn", VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {Icon && <Icon size={size === "xs" || size === "sm" ? 13 : 15} className="flex-shrink-0" />}
      {children}
      {IconRight && <IconRight size={13} className="flex-shrink-0" />}
    </button>
  );
}
