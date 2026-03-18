import { clsx } from "clsx";

const VARIANTS = {
  default:  "card",
  elevated: "card-elevated",
  flat:     "card-flat",
  dark:     "card-dark",
  care:     "bg-mw-primary-50 border border-mw-primary-200 rounded-xl overflow-hidden",
};

export function Card({ variant = "default", className, children, ...props }) {
  return (
    <div className={clsx(VARIANTS[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={clsx("px-5 pt-5 pb-3", className)}>{children}</div>
  );
}

export function CardBody({ className, children }) {
  return (
    <div className={clsx("px-5 pb-5", className)}>{children}</div>
  );
}

export function CardFooter({ className, children }) {
  return (
    <div className={clsx("px-5 py-4 border-t border-mw-surface-border", className)}>{children}</div>
  );
}
