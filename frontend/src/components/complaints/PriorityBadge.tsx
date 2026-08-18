import React from 'react';
import { ComplaintPriority } from '../../types';
import { PRIORITY_CONFIG } from '../../config/statusConfig';

export interface PriorityBadgeProps {
  priority: ComplaintPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className = '',
}) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badgeClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  );
};
