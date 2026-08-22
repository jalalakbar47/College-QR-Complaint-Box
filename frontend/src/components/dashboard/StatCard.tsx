import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion, MOTION_EASINGS } from '../../lib/motion';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'blue' | 'gold' | 'amber' | 'emerald' | 'green' | 'rose' | 'red' | 'purple' | 'slate';
  subtitle?: string;
  isCritical?: boolean;
  onClick?: () => void;
}

const CountUpDisplay: React.FC<{ value: number | string }> = ({ value }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const numericValue = typeof value === 'number' ? value : parseInt(String(value), 10);
  const isNumeric = !isNaN(numericValue);

  const [displayNumber, setDisplayNumber] = useState<number>(() =>
    prefersReducedMotion || !isNumeric ? (isNumeric ? numericValue : 0) : 0
  );
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!isNumeric || prefersReducedMotion) {
      setDisplayNumber(isNumeric ? numericValue : 0);
      return;
    }

    if (hasMountedRef.current) {
      // Background refresh: update directly without re-running full count-up
      setDisplayNumber(numericValue);
      return;
    }

    hasMountedRef.current = true;
    const duration = 600; // 600ms
    const startTimestamp = performance.now();
    const startValue = 0;
    const targetValue = numericValue;

    if (targetValue === 0) {
      setDisplayNumber(0);
      return;
    }

    let animationFrameId: number;

    const step = (now: number) => {
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (targetValue - startValue) * easeProgress);

      setDisplayNumber(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayNumber(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [numericValue, isNumeric, prefersReducedMotion]);

  if (!isNumeric) {
    return <span>{value}</span>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={String(value)}
        initial={{ opacity: hasMountedRef.current ? 0.7 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: MOTION_EASINGS.standardEase }}
      >
        {displayNumber}
      </motion.span>
    </AnimatePresence>
  );
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = 'blue',
  subtitle,
  isCritical = false,
  onClick,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

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
    <motion.div
      onClick={onClick}
      whileHover={
        onClick && !prefersReducedMotion
          ? { y: -2, transition: { duration: 0.15 } }
          : undefined
      }
      whileTap={
        onClick && !prefersReducedMotion
          ? { scale: 0.99, transition: { duration: 0.1 } }
          : undefined
      }
      className={`rounded-xl border p-4 sm:p-5 shadow-sm transition-colors duration-150 flex items-center justify-between bg-paper-card ${criticalClass} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="min-w-0 pr-3">
        <span className="text-xs font-mono uppercase tracking-wider text-ink-muted block mb-1 truncate">
          {label}
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-normal text-ink-navy tracking-tight">
          <CountUpDisplay value={value} />
        </h3>
        {subtitle && <p className="text-[11px] text-ink-muted mt-1 truncate">{subtitle}</p>}
      </div>

      <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 shadow-2xs ${style.iconBg}`}>
        {icon}
      </div>
    </motion.div>
  );
};
