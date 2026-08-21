import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3.5 bg-paper-card border border-hairline rounded-xl text-xs text-ink-muted shadow-sm">
      <div className="font-mono text-xs">
        Showing <span className="font-semibold text-ink-navy">{startItem}</span> to{' '}
        <span className="font-semibold text-ink-navy">{endItem}</span> of{' '}
        <span className="font-semibold text-ink-navy">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          className="text-xs"
        >
          Previous
        </Button>
        <div className="text-xs font-mono font-medium text-ink-navy px-2">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight className="w-4 h-4" />}
          className="text-xs"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
