import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  interactive = false,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-paper-card border border-hairline shadow-sm',
    elevated: 'bg-paper-card border border-hairline shadow-elevated',
    flat: 'bg-paper border border-hairline',
    bordered: 'bg-paper-card border-2 border-hairline',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`rounded-xl transition-shadow duration-150 ${variantClasses[variant]} ${
        paddingClasses[padding]
      } ${interactive ? 'hover:shadow-md cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}> = ({ title, subtitle, action, className = '', children }) => {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      {children ? (
        children
      ) : (
        <>
          <div>
            {title && <h3 className="font-semibold text-ink-navy text-base sm:text-lg">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-ink-muted mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </>
      )}
    </div>
  );
};
