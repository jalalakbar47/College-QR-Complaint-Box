import React from 'react';
import { Pill } from './Pill';
import { ComplaintStatus } from '../../types';

export interface TicketStubProps extends React.HTMLAttributes<HTMLDivElement> {
  referenceId?: string;
  eyebrow?: string;
  status?: ComplaintStatus | string;
  statusPill?: React.ReactNode;
  topRight?: React.ReactNode;
  headerContent?: React.ReactNode;
  interactive?: boolean;
  notchBgColor?: string; // in case card is on a non-standard background
  children?: React.ReactNode;
}

// Map ComplaintStatus string to Pill variant
function mapStatusToPillVariant(status?: string) {
  if (!status) return 'new';
  const s = status.toLowerCase().trim();
  if (s === 'new') return 'new';
  if (s === 'in progress' || s === 'in-progress' || s === 'under review' || s === 'under-review' || s === 'assigned') {
    return 'in-progress';
  }
  if (s === 'resolved') return 'resolved';
  if (s === 'rejected' || s === 'critical') return 'rejected';
  if (s === 'closed') return 'closed';
  return 'new';
}

export const TicketStub: React.FC<TicketStubProps> = ({
  referenceId,
  eyebrow = 'OFFICIAL REFERENCE ID',
  status,
  statusPill,
  topRight,
  headerContent,
  interactive = false,
  notchBgColor = 'bg-paper',
  className = '',
  children,
  ...props
}) => {
  const hasCustomHeader = Boolean(headerContent);
  const hasStandardHeader = Boolean(referenceId || status || statusPill || topRight);

  return (
    <div
      className={`relative bg-paper-card rounded-xl border border-hairline overflow-hidden shadow-sm transition-shadow duration-150 ${
        interactive ? 'hover:shadow-md cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {/* Top Part: Reference ID + Small Caps Eyebrow + Status Pill */}
      {(hasStandardHeader || hasCustomHeader) && (
        <div className="p-4 sm:p-5">
          {hasCustomHeader ? (
            headerContent
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                {eyebrow && (
                  <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-ink-muted font-medium mb-1">
                    {eyebrow}
                  </p>
                )}
                {referenceId && (
                  <p className="font-mono font-semibold text-ink-navy text-sm sm:text-base tracking-tight truncate">
                    {referenceId}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {statusPill ? (
                  statusPill
                ) : status ? (
                  <Pill variant={mapStatusToPillVariant(status)} label={status} />
                ) : null}
                {topRight}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ticket Stub Divider with Semitransparent / Circular Edge Notches */}
      {(hasStandardHeader || hasCustomHeader) && (
        <div className="relative flex items-center w-full select-none" aria-hidden="true">
          {/* Left Notch */}
          <div
            className={`absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${notchBgColor} border border-hairline z-10`}
          />
          
          {/* Horizontal Dashed Line */}
          <div className="w-full border-b border-dashed border-hairline mx-3" />

          {/* Right Notch */}
          <div
            className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${notchBgColor} border border-hairline z-10`}
          />
        </div>
      )}

      {/* Bottom Part: Main Content */}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};
