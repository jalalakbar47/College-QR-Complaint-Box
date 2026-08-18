import React from 'react';

export const Skeleton: React.FC<{
  className?: string;
  count?: number;
}> = ({ className = 'h-4 w-full', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`}
        />
      ))}
    </>
  );
};
