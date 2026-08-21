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
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    dotClass: 'bg-blue-500',
    borderClass: 'border-blue-300',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    description: 'Complaint has been recorded and is awaiting proctor review.',
  },
  'Under Review': {
    label: 'Under Review',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    dotClass: 'bg-amber-500',
    borderClass: 'border-amber-300',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    description: 'Proctor office is currently evaluating the complaint.',
  },
  Assigned: {
    label: 'Assigned',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
    dotClass: 'bg-purple-500',
    borderClass: 'border-purple-300',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-700',
    description: 'Assigned to relevant campus department/staff for action.',
  },
  'In Progress': {
    label: 'In Progress',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20',
    dotClass: 'bg-orange-500',
    borderClass: 'border-orange-300',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-700',
    description: 'Corrective measures or investigation actively underway.',
  },
  Resolved: {
    label: 'Resolved',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    dotClass: 'bg-emerald-500',
    borderClass: 'border-emerald-300',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    description: 'Issue has been addressed and resolution has been recorded.',
  },
  Rejected: {
    label: 'Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    dotClass: 'bg-rose-500',
    borderClass: 'border-rose-300',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    description: 'Complaint evaluated but not actionable or dismissed.',
  },
  Closed: {
    label: 'Closed',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
    dotClass: 'bg-slate-400',
    borderClass: 'border-slate-300',
    bgClass: 'bg-slate-50',
    textClass: 'text-slate-700',
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
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
    level: 1,
  },
  Medium: {
    label: 'Medium',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
    level: 2,
  },
  High: {
    label: 'High',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    level: 3,
  },
  Critical: {
    label: 'Critical',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold ring-2 ring-rose-400/30 animate-pulse',
    dotClass: 'bg-rose-600',
    level: 4,
  },
};
