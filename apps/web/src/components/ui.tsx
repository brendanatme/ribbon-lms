import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function Button({
  children,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const styles = {
    primary: 'bg-ribbon text-white hover:bg-ink disabled:opacity-50',
    ghost: 'bg-transparent text-ribbon border border-ribbon/30 hover:bg-ribbon-light',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
  }[variant];
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ribbon focus:ring-offset-2 ${styles} ${props.className ?? ''}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-ink/10 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-ink/10"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-ribbon transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-ribbon-light px-2.5 py-0.5 text-xs font-medium text-ribbon">
      {children}
    </span>
  );
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
    </header>
  );
}
