import { ComplaintPriority, ComplaintStatus } from '../types';

export interface StatusStyle {
  label: string;
  badgeClass: string;
  dotClass: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  description: string;
}

export const STATUS_CONFIG: Record<ComplaintStatus, StatusStyle> = {
  New: {
    label: 'New',
    badgeClass: 'bg-registrar-blue/10 text-registrar-blue border-registrar-blue/20',
    dotClass: 'bg-registrar-blue',
    borderClass: 'border-registrar-blue/30',
    bgClass: 'bg-registrar-blue/10',
    textClass: 'text-registrar-blue',
    description: 'Complaint has been recorded and is awaiting proctor review.',
  },
  'Under Review': {
    label: 'Under Review',
    badgeClass: 'bg-seal-gold/10 text-seal-gold border-seal-gold/20',
    dotClass: 'bg-seal-gold',
    borderClass: 'border-seal-gold/30',
    bgClass: 'bg-seal-gold/10',
    textClass: 'text-seal-gold',
    description: 'Proctor office is currently evaluating the complaint.',
  },
  Assigned: {
    label: 'Assigned',
    badgeClass: 'bg-seal-gold/10 text-seal-gold border-seal-gold/20',
    dotClass: 'bg-seal-gold',
    borderClass: 'border-seal-gold/30',
    bgClass: 'bg-seal-gold/10',
    textClass: 'text-seal-gold',
    description: 'Assigned to relevant campus department/staff for action.',
  },
  'In Progress': {
    label: 'In Progress',
    badgeClass: 'bg-seal-gold/10 text-seal-gold border-seal-gold/20',
    dotClass: 'bg-seal-gold',
    borderClass: 'border-seal-gold/30',
    bgClass: 'bg-seal-gold/10',
    textClass: 'text-seal-gold',
    description: 'Corrective measures or investigation actively underway.',
  },
  Resolved: {
    label: 'Resolved',
    badgeClass: 'bg-ledger-green/10 text-ledger-green border-ledger-green/20',
    dotClass: 'bg-ledger-green',
    borderClass: 'border-ledger-green/30',
    bgClass: 'bg-ledger-green/10',
    textClass: 'text-ledger-green',
    description: 'Issue has been addressed and resolution has been recorded.',
  },
  Rejected: {
    label: 'Rejected',
    badgeClass: 'bg-case-red/10 text-case-red border-case-red/20',
    dotClass: 'bg-case-red',
    borderClass: 'border-case-red/30',
    bgClass: 'bg-case-red/10',
    textClass: 'text-case-red',
    description: 'Complaint evaluated but not actionable or dismissed.',
  },
  Closed: {
    label: 'Closed',
    badgeClass: 'bg-ink-muted/10 text-ink-muted border-ink-muted/20',
    dotClass: 'bg-ink-muted',
    borderClass: 'border-hairline',
    bgClass: 'bg-paper',
    textClass: 'text-ink-muted',
    description: 'Complaint ticket has reached its end of cycle.',
  },
};

export interface PriorityStyle {
  label: string;
  badgeClass: string;
  dotClass: string;
  level: number;
}

export const PRIORITY_CONFIG: Record<ComplaintPriority, PriorityStyle> = {
  Low: {
    label: 'Low',
    badgeClass: 'bg-paper text-ink-muted border-hairline',
    dotClass: 'bg-ink-muted',
    level: 1,
  },
  Medium: {
    label: 'Medium',
    badgeClass: 'bg-registrar-blue/10 text-registrar-blue border-registrar-blue/20',
    dotClass: 'bg-registrar-blue',
    level: 2,
  },
  High: {
    label: 'High',
    badgeClass: 'bg-seal-gold/10 text-seal-gold border-seal-gold/20',
    dotClass: 'bg-seal-gold',
    level: 3,
  },
  Critical: {
    label: 'Critical',
    badgeClass: 'bg-case-red/10 text-case-red border-case-red/20 font-semibold',
    dotClass: 'bg-case-red',
    level: 4,
  },
};
