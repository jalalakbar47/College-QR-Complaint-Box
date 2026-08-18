import React from 'react';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'blue' | 'amber' | 'emerald' | 'rose' | 'purple' | 'slate';
  subtitle?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = 'blue',
  subtitle,
  onClick,
}) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200/60',
      iconBg: 'bg-blue-600 text-white',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200/60',
      iconBg: 'bg-amber-600 text-white',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/60',
      iconBg: 'bg-emerald-600 text-white',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200/60',
      iconBg: 'bg-rose-600 text-white animate-pulse',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200/60',
      iconBg: 'bg-purple-600 text-white',
    },
    slate: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200/60',
      iconBg: 'bg-slate-800 text-white',
    },
  };

  const currentStyle = colorStyles[color];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-5 shadow-subtle hover:shadow-card transition-all duration-200 flex items-center justify-between ${
        onClick ? 'cursor-pointer hover:border-brand-300' : ''
      } ${currentStyle.border}`}
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
          {label}
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </h3>
        {subtitle && <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 ${currentStyle.iconBg}`}>
        {icon}
      </div>
    </div>
  );
};
