import React from 'react';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'blue' | 'gold' | 'amber' | 'emerald' | 'green' | 'rose' | 'red' | 'purple' | 'slate';
  subtitle?: string;
  isCritical?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = 'blue',
  subtitle,
  isCritical = false,
  onClick,
}) => {
  const colorStyles = {
    blue: {
      border: 'border-hairline hover:border-registrar-blue',
      iconBg: 'bg-registrar-blue/10 text-registrar-blue border border-registrar-blue/20',
    },
    gold: {
      border: 'border-hairline hover:border-seal-gold',
      iconBg: 'bg-seal-gold/10 text-seal-gold border border-seal-gold/20',
    },
    amber: {
      border: 'border-hairline hover:border-seal-gold',
      iconBg: 'bg-seal-gold/10 text-seal-gold border border-seal-gold/20',
    },
    emerald: {
      border: 'border-hairline hover:border-ledger-green',
      iconBg: 'bg-ledger-green/10 text-ledger-green border border-ledger-green/20',
    },
    green: {
      border: 'border-hairline hover:border-ledger-green',
      iconBg: 'bg-ledger-green/10 text-ledger-green border border-ledger-green/20',
    },
    rose: {
      border: 'border-case-red/30 hover:border-case-red bg-case-red/5',
      iconBg: 'bg-case-red/10 text-case-red border border-case-red/20',
    },
    red: {
      border: 'border-case-red/30 hover:border-case-red bg-case-red/5',
      iconBg: 'bg-case-red/10 text-case-red border border-case-red/20',
    },
    purple: {
      border: 'border-hairline hover:border-seal-gold',
      iconBg: 'bg-seal-gold/10 text-seal-gold border border-seal-gold/20',
    },
    slate: {
      border: 'border-hairline hover:border-ink-muted',
      iconBg: 'bg-paper text-ink-muted border border-hairline',
    },
  };

  const style = colorStyles[color] || colorStyles.blue;
  const criticalClass = isCritical ? 'border-case-red/30 bg-case-red/5' : style.border;

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 sm:p-5 shadow-sm transition-all duration-150 flex items-center justify-between bg-paper-card ${criticalClass} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="min-w-0 pr-3">
        <span className="text-xs font-mono uppercase tracking-wider text-ink-muted block mb-1 truncate">
          {label}
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-normal text-ink-navy tracking-tight">
          {value}
        </h3>
        {subtitle && <p className="text-[11px] text-ink-muted mt-1 truncate">{subtitle}</p>}
      </div>

      <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 shadow-2xs ${style.iconBg}`}>
        {icon}
      </div>
    </div>
  );
};
