import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white border border-slate-200/80 shadow-subtle',
    elevated: 'bg-white border border-slate-200/60 shadow-elevated',
    flat: 'bg-slate-50 border border-slate-200/60',
    bordered: 'bg-white border-2 border-slate-200',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
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
            {title && <h3 className="font-semibold text-slate-900 text-base sm:text-lg">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </>
      )}
    </div>
  );
};
