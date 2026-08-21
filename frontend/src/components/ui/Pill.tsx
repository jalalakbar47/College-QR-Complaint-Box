import React from 'react';

export type PillVariant =
  | 'new'
  | 'in-progress'
  | 'under-review'
  | 'assigned'
  | 'resolved'
  | 'rejected'
  | 'critical'
  | 'closed'
  | 'neutral'
  | 'gold'
  | 'blue'
  | 'green'
  | 'red';

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: PillVariant;
  label?: string;
  dot?: boolean;
  size?: 'sm' | 'md';
}

const VARIANT_STYLES: Record<PillVariant, { bg: string; text: string; border: string; dot: string }> = {
  new: {
    bg: 'bg-registrar-blue/10',
    text: 'text-registrar-blue',
    border: 'border-registrar-blue/20',
    dot: 'bg-registrar-blue',
  },
  blue: {
    bg: 'bg-registrar-blue/10',
    text: 'text-registrar-blue',
    border: 'border-registrar-blue/20',
    dot: 'bg-registrar-blue',
  },
  'in-progress': {
    bg: 'bg-seal-gold/10',
    text: 'text-seal-gold',
    border: 'border-seal-gold/20',
    dot: 'bg-seal-gold',
  },
  'under-review': {
    bg: 'bg-seal-gold/10',
    text: 'text-seal-gold',
    border: 'border-seal-gold/20',
    dot: 'bg-seal-gold',
  },
  assigned: {
    bg: 'bg-seal-gold/10',
    text: 'text-seal-gold',
    border: 'border-seal-gold/20',
    dot: 'bg-seal-gold',
  },
  gold: {
    bg: 'bg-seal-gold/10',
    text: 'text-seal-gold',
    border: 'border-seal-gold/20',
    dot: 'bg-seal-gold',
  },
  resolved: {
    bg: 'bg-ledger-green/10',
    text: 'text-ledger-green',
    border: 'border-ledger-green/20',
    dot: 'bg-ledger-green',
  },
  green: {
    bg: 'bg-ledger-green/10',
    text: 'text-ledger-green',
    border: 'border-ledger-green/20',
    dot: 'bg-ledger-green',
  },
  rejected: {
    bg: 'bg-case-red/10',
    text: 'text-case-red',
    border: 'border-case-red/20',
    dot: 'bg-case-red',
  },
  critical: {
    bg: 'bg-case-red/10',
    text: 'text-case-red',
    border: 'border-case-red/20',
    dot: 'bg-case-red',
  },
  red: {
    bg: 'bg-case-red/10',
    text: 'text-case-red',
    border: 'border-case-red/20',
    dot: 'bg-case-red',
  },
  closed: {
    bg: 'bg-ink-muted/10',
    text: 'text-ink-muted',
    border: 'border-ink-muted/20',
    dot: 'bg-ink-muted',
  },
  neutral: {
    bg: 'bg-ink-muted/10',
    text: 'text-ink-muted',
    border: 'border-ink-muted/20',
    dot: 'bg-ink-muted',
  },
};

export const Pill: React.FC<PillProps> = ({
  children,
  label,
  variant = 'new',
  dot = true,
  size = 'md',
  className = '',
  ...props
}) => {
  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.new;
  const content = label || children;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase tracking-wide border font-medium select-none ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />}
      <span>{content}</span>
    </span>
  );
};
