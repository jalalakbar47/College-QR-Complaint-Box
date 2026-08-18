import React from 'react';
import { ComplaintStatus } from '../../types';
import { STATUS_CONFIG } from '../../config/statusConfig';

export interface ComplaintStatusBadgeProps {
  status: ComplaintStatus;
  showDot?: boolean;
  className?: string;
}

export const ComplaintStatusBadge: React.FC<ComplaintStatusBadgeProps> = ({
  status,
  showDot = true,
  className = '',
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.New;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass} ${className}`}
      title={config.description}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />}
      <span>{config.label}</span>
    </span>
  );
};
