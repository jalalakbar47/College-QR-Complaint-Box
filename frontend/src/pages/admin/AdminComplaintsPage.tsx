import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useComplaints } from '../../hooks/useComplaints';
import { useCategories } from '../../hooks/useCategories';
import { useLocations } from '../../hooks/useLocations';
import { useDebounce } from '../../hooks/useDebounce';
import { ComplaintFilter, FilterState } from '../../components/complaints/ComplaintFilter';
import { ComplaintTable } from '../../components/complaints/ComplaintTable';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';

const PAGE_SIZE = 10;

export const AdminComplaintsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'All',
    priority: searchParams.get('priority') || 'All',
    category: searchParams.get('category') || 'All',
    location: searchParams.get('location') || 'All',
    department: searchParams.get('department') || 'All',
  });

  const debouncedSearch = useDebounce(filters.search, 300);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { categories } = useCategories();
  const { locations } = useLocations();

  const { complaints, isLoading, error, refetch } = useComplaints({
    search: debouncedSearch,
    status: filters.status,
    priority: filters.priority,
    category: filters.category,
    location: filters.location,
    department: filters.department,
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...newFilters };
      // Sync URL params
      const params: Record<string, string> = {};
      if (next.search) params.search = next.search;
      if (next.status !== 'All') params.status = next.status;
      if (next.priority !== 'All') params.priority = next.priority;
      if (next.category !== 'All') params.category = next.category;
      if (next.location !== 'All') params.location = next.location;
      if (next.department !== 'All') params.department = next.department;
      setSearchParams(params);
      return next;
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const emptyFilters: FilterState = {
      search: '',
      status: 'All',
      priority: 'All',
      category: 'All',
      location: 'All',
      department: 'All',
    };
    setFilters(emptyFilters);
    setSearchParams({});
    setCurrentPage(1);
  };

  // Pagination slicing
  const totalItems = complaints.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedComplaints = complaints.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Complaints Repository</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View, search, and manage all student grievances submitted to the Proctor Office.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
            leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Component */}
      <ComplaintFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={categories}
        locations={locations}
      />

      {/* Complaints Content */}
      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner size="lg" label="Loading complaint records from Google Sheets..." />
        </div>
      ) : error ? (
        <ErrorState
          title="Error retrieving complaints"
          message={error}
          onRetry={refetch}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>Showing {paginatedComplaints.length} of {totalItems} grievances</span>
          </div>

          <ComplaintTable complaints={paginatedComplaints} isLoading={isLoading} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
