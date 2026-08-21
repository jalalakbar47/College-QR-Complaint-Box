import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  dotColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-paper text-ink-muted border-hairline',
    primary: 'bg-registrar-blue/10 text-registrar-blue border-registrar-blue/20',
    success: 'bg-ledger-green/10 text-ledger-green border-ledger-green/20',
    warning: 'bg-seal-gold/10 text-seal-gold border-seal-gold/20',
    gold: 'bg-seal-gold/10 text-seal-gold border-seal-gold/20',
    danger: 'bg-case-red/10 text-case-red border-case-red/20',
    info: 'bg-registrar-blue/10 text-registrar-blue border-registrar-blue/20',
    purple: 'bg-seal-gold/10 text-seal-gold border-seal-gold/20',
    neutral: 'bg-paper text-ink-muted border-hairline',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-medium gap-1.5',
    lg: 'text-sm px-3 py-1.5 font-semibold gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-tight select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColor || 'bg-current'
          }`}
        />
      )}
      {children}
    </span>
  );
};
