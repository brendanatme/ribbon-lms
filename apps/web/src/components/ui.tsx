import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

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

// Shared base for all text-entry controls. Width is left to the caller
// (`w-full`, `flex-1`, …) so the same control fits both full-width forms and
// compact inline rows.
const FIELD_CLASS =
  'rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-ribbon focus:outline-none focus:ring-1 focus:ring-ribbon';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${FIELD_CLASS} ${className}`} />;
}

export function Textarea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${FIELD_CLASS} ${className}`} />;
}

// Labelled input for stacked forms (auth, etc.).
export function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink/70">{label}</span>
      <Input className="w-full" {...props} />
    </label>
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

const BADGE_TONES = {
  ribbon: 'bg-ribbon-light text-ribbon',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-700',
};

export function Badge({
  children,
  tone = 'ribbon',
}: {
  children: ReactNode;
  tone?: keyof typeof BADGE_TONES;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_TONES[tone]}`}
    >
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

// Inline "loading…" line used while a page's primary query is in flight.
export function Loading({ children = 'Loading…' }: { children?: ReactNode }) {
  return <p className="text-ink/40">{children}</p>;
}

// Full-viewport centered message, used by route guards and redirects.
export function CenteredMessage({ children }: { children: ReactNode }) {
  return <div className="grid min-h-screen place-items-center text-ink/50">{children}</div>;
}

// Empty-state placeholder: a card with centered muted text (and optional links).
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <Card>
      <p className="text-center text-ink/50">{children}</p>
    </Card>
  );
}
