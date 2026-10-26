"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { cn } from "../../utils/cn";

/* ---------------------------------- Button ---------------------------------- */
type ButtonVariant = "primary" | "outline" | "ghost" | "destructive" | "dark";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export function Button({
  variant = "primary",
  size = "md",
  className,
  loading,
  disabled,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fashion/50 focus-visible:ring-offset-2";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-plum text-white hover:bg-deep-rose active:bg-plum shadow-sm",
    outline:
      "border border-plum text-plum bg-transparent hover:bg-plum hover:text-white",
    ghost: "text-plum hover:bg-blush/60",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    dark: "bg-deep-rose text-white hover:bg-plum",
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "text-xs px-3.5 py-2 rounded-md",
    md: "text-sm px-5 py-2.5 rounded-md",
    lg: "text-sm px-8 py-3.5 rounded-md uppercase",
    icon: "p-2 rounded-full",
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

/* ---------------------------------- Badge ---------------------------------- */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "pink" | "info";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-gray-100 text-gray-700",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    pink: "bg-blush text-deep-rose border border-rose/40",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function statusTone(
  status: string,
): "neutral" | "success" | "warning" | "danger" | "pink" | "info" {
  const map: Record<
    string,
    "neutral" | "success" | "warning" | "danger" | "pink" | "info"
  > = {
    Confirmada: "success",
    "Pagado completo": "success",
    Completada: "success",
    Publicada: "success",
    Activo: "success",
    Pagado: "success",
    Pendiente: "warning",
    "Seña pagada": "warning",
    Nueva: "info",
    Nuevo: "info",
    "En curso": "info",
    Abierta: "info",
    VIP: "pink",
    Cancelada: "danger",
    "No show": "danger",
    Reportada: "danger",
    Inactivo: "neutral",
    Resuelta: "neutral",
    Reembolsado: "neutral",
    Parcial: "warning",
  };
  return map[status] ?? "neutral";
}

/* ---------------------------------- Card ---------------------------------- */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-soft bg-surface shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------------------------------- Inputs ---------------------------------- */
export function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-plum/70"
    >
      {children}
    </label>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-md border border-border-soft bg-white px-3.5 py-2.5 text-sm text-plum placeholder:text-muted focus:border-fashion focus:outline-none focus:ring-2 focus:ring-fashion/20",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-md border border-border-soft bg-white px-3.5 py-2.5 text-sm text-plum placeholder:text-muted focus:border-fashion focus:outline-none focus:ring-2 focus:ring-fashion/20",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-md border border-border-soft bg-white px-3.5 py-2.5 text-sm text-plum focus:border-fashion focus:outline-none focus:ring-2 focus:ring-fashion/20",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

/* ---------------------------------- Star Rating ---------------------------------- */
export function StarRating({
  value,
  onChange,
  size = 16,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  if (readOnly && (!Number.isFinite(value) || value <= 0)) return <span className="text-xs text-muted">Sin opiniones verificadas</span>;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5",
        !readOnly && "cursor-pointer",
      )}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          onMouseEnter={() => !readOnly && setHover(i)}
          onMouseLeave={() => !readOnly && setHover(null)}
          onClick={() => !readOnly && onChange?.(i)}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={display >= i ? "#D46896" : "none"}
          stroke={display >= i ? "#D46896" : "#C9BEC5"}
          strokeWidth={1.5}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ---------------------------------- Tabs ---------------------------------- */
export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto border-b border-border-soft",
        className,
      )}
    >
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
            active === t
              ? "border-fashion text-deep-rose"
              : "border-transparent text-muted hover:text-plum",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------- Modal ---------------------------------- */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-plum/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white shadow-2xl animate-fade-in-up",
          sizes[size],
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
            <h3 className="font-display text-xl text-plum">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded-full p-1.5 text-muted hover:bg-blush/60 hover:text-plum"
            >
              <CloseIcon />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-border-soft px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- Drawer ---------------------------------- */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-plum/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 flex h-full w-full flex-col bg-white shadow-2xl animate-fade-in-up",
          width,
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
            <h3 className="font-display text-xl text-plum">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded-full p-1.5 text-muted hover:bg-blush/60 hover:text-plum"
            >
              <CloseIcon />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-border-soft px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------------- KPI Card ---------------------------------- */
export function KpiCard({
  label,
  value,
  delta,
  deltaTone = "success",
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "success" | "danger";
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </p>
        {icon && <div className="text-rose">{icon}</div>}
      </div>
      <p className="mt-2 font-display text-2xl text-plum">{value}</p>
      {delta && (
        <p
          className={cn(
            "mt-1 text-xs font-semibold",
            deltaTone === "success" ? "text-emerald-600" : "text-red-600",
          )}
        >
          {delta}
        </p>
      )}
    </Card>
  );
}

/* ---------------------------------- Empty / Loading / Error states ---------------------------------- */
export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-soft bg-blush/20 px-6 py-16 text-center">
      <div className="mb-4 text-4xl">{icon ?? "✦"}</div>
      <h4 className="font-display text-lg text-plum">{title}</h4>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-shimmer rounded-md", className)} />;
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
      <p className="font-semibold text-red-700">Ocurrió un error</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  );
}

/* ---------------------------------- Tooltip ---------------------------------- */
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max -translate-x-1/2 rounded-md bg-plum px-2.5 py-1.5 text-[11px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}

/* ---------------------------------- Avatar ---------------------------------- */
export function Avatar({
  src,
  name,
  size = 40,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-blush font-display text-deep-rose"
    >
      {initials}
    </div>
  );
}

/* ---------------------------------- Toast ---------------------------------- */
interface Toast {
  id: number;
  message: string;
  tone?: "success" | "error" | "info";
}
const ToastContext = createContext<{
  push: (m: string, tone?: Toast["tone"]) => void;
}>({ push: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (message: string, tone: Toast["tone"] = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "animate-fade-in-up rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg",
              t.tone === "error"
                ? "bg-red-600"
                : t.tone === "info"
                  ? "bg-plum"
                  : "bg-deep-rose",
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() {
  return useContext(ToastContext);
}

/* ---------------------------------- Switch ---------------------------------- */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5">
      <span
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-fashion" : "bg-gray-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </span>
      {label && <span className="text-sm text-plum">{label}</span>}
    </label>
  );
}

/* ---------------------------------- useReducedMotion ---------------------------------- */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

/* ---------------------------------- Section helpers ---------------------------------- */
export function SectionLabel({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={cn(
        "mb-3 text-xs font-bold uppercase tracking-[0.25em]",
        light ? "text-blush" : "text-deep-rose",
      )}
    >
      {children}
    </p>
  );
}
