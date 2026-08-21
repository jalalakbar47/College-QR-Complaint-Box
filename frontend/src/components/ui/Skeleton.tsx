import React from 'react';

/**
 * Base atomic Skeleton component with modern shimmer animation
 */
export const Skeleton: React.FC<{
  className?: string;
  count?: number;
}> = ({ className = 'h-4 w-full', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse rounded-lg bg-slate-200/90 ${className}`}
        />
      ))}
    </>
  );
};

/**
 * Modern Skeleton for Table Rows and Headers
 */
export const TableSkeleton: React.FC<{
  rows?: number;
  cols?: number;
}> = ({ rows = 6 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
      {/* Header bar placeholder */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
      </div>

      {/* Row placeholders */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-4 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4 flex-1">
              {/* ID & Date */}
              <div className="w-28 space-y-1.5 flex-shrink-0">
                <div className="h-5 w-24 bg-slate-200 rounded-md" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>

              {/* Category & Location */}
              <div className="w-36 space-y-1.5 flex-shrink-0">
                <div className="h-4 w-28 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>

              {/* Title & Description */}
              <div className="flex-1 space-y-1.5 min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-14 bg-slate-200 rounded-full" />
                  <div className="h-4 w-3/5 bg-slate-200 rounded" />
                </div>
                <div className="h-3 w-4/5 bg-slate-100 rounded" />
              </div>
            </div>

            {/* Student Info */}
            <div className="w-28 space-y-1.5 flex-shrink-0 hidden sm:block">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-3 w-14 bg-slate-100 rounded" />
            </div>

            {/* Status Badge */}
            <div className="w-24 flex-shrink-0 hidden md:block">
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>

            {/* Action */}
            <div className="w-16 flex-shrink-0 text-right">
              <div className="h-7 w-14 bg-slate-200 rounded-lg ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Modern Skeleton for Dashboard 5-KPI Stats Grid
 */
export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle flex flex-col justify-between space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-24 bg-slate-200 rounded" />
            <div className="w-9 h-9 rounded-xl bg-slate-200" />
          </div>
          <div className="space-y-1.5">
            <div className="h-7 w-16 bg-slate-300 rounded-md" />
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Modern Skeleton for Complaint Detail Page
 */
export const ComplaintDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Bar Header */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-28 bg-slate-200 rounded-md" />
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
          </div>
          <div className="h-6 w-72 bg-slate-300 rounded" />
          <div className="h-3.5 w-48 bg-slate-100 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-36 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Content & Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Details Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-slate-100 rounded" />
              <div className="h-3.5 w-full bg-slate-100 rounded" />
              <div className="h-3.5 w-3/4 bg-slate-100 rounded" />
            </div>
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity / Resolution Form Placeholder */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-24 w-full bg-slate-100 rounded-xl" />
            <div className="h-10 w-32 bg-slate-200 rounded-xl ml-auto" />
          </div>
        </div>

        {/* Right 4 cols: Student & Proctor Meta */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="space-y-3">
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Modern Skeleton for Category & Location Grid Cards
 */
export const CardListSkeleton: React.FC<{
  count?: number;
}> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-20 bg-slate-200 rounded" />
            <div className="h-5 w-14 bg-slate-100 rounded-full" />
          </div>
          <div className="space-y-1.5">
            <div className="h-5 w-3/4 bg-slate-300 rounded" />
            <div className="h-3.5 w-full bg-slate-100 rounded" />
            <div className="h-3.5 w-2/3 bg-slate-100 rounded" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="h-7 w-16 bg-slate-200 rounded-lg" />
            <div className="h-7 w-16 bg-slate-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
