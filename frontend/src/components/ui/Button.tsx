import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  // Shared design system button: rounded-lg, font-medium, 150ms transition, no scale/bounce, visible focus rings
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registrar-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-sm px-4 py-2.5 min-h-[44px] gap-2',
    lg: 'text-base px-5 py-3 min-h-[48px] gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-registrar-blue hover:bg-registrar-blue/90 active:bg-registrar-blue text-white shadow-sm border border-transparent',
    secondary:
      'bg-paper-card hover:bg-paper active:bg-paper/80 text-ink-navy border border-hairline shadow-sm',
    ghost:
      'bg-transparent hover:bg-hairline/60 active:bg-hairline text-ink-muted hover:text-ink-navy border border-transparent',
    outline:
      'bg-transparent hover:bg-paper active:bg-hairline/40 text-ink-navy border border-hairline',
    danger:
      'bg-case-red hover:bg-case-red/90 active:bg-case-red text-white shadow-sm border border-transparent focus-visible:ring-case-red',
    success:
      'bg-ledger-green hover:bg-ledger-green/90 active:bg-ledger-green text-white shadow-sm border border-transparent focus-visible:ring-ledger-green',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
