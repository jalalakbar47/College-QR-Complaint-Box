import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DEPARTMENTS } from '../../config/constants';

export interface FilterState {
  search: string;
  status: string;
  priority: string;
  category: string;
  location: string;
  department: string;
}

export interface ComplaintFilterProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  categories: { category_name: string }[];
  locations: { location_name: string }[];
}

export const ComplaintFilter: React.FC<ComplaintFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
  categories,
  locations,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.category !== 'All' ||
    filters.location !== 'All' ||
    filters.department !== 'All';

  return (
    <div className="bg-paper-card rounded-xl border border-hairline p-4 sm:p-5 shadow-sm mb-6 space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-ink-navy font-semibold text-xs sm:text-sm uppercase tracking-wider font-mono">
          <Filter className="w-4 h-4 text-registrar-blue" />
          <span>Filter &amp; Search Complaints</span>
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs text-case-red hover:text-case-red hover:bg-case-red/10"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Row 1: Search Input (Full Width) */}
      <div>
        <Input
          placeholder="Search by ID, keyword, student name..."
          leftIcon={<Search className="w-4 h-4 text-ink-muted" />}
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="font-medium"
        />
      </div>

      {/* Row 2: 4 Select Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Status Filter */}
        <Select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          options={[
            { value: 'All', label: 'All Statuses' },
            { value: 'New', label: 'New' },
            { value: 'Under Review', label: 'Under Review' },
            { value: 'Assigned', label: 'Assigned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Resolved', label: 'Resolved' },
            { value: 'Rejected', label: 'Rejected' },
            { value: 'Closed', label: 'Closed' },
          ]}
        />

        {/* Priority Filter */}
        <Select
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          options={[
            { value: 'All', label: 'All Priorities' },
            { value: 'Critical', label: 'Critical' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
          ]}
        />

        {/* Category Filter */}
        <Select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          options={[
            { value: 'All', label: 'All Categories' },
            ...categories.map((c) => ({
              value: c.category_name,
              label: c.category_name,
            })),
          ]}
        />

        {/* Location Filter */}
        <Select
          value={filters.location}
          onChange={(e) => onFilterChange({ location: e.target.value })}
          options={[
            { value: 'All', label: 'All Locations' },
            ...locations.map((l) => ({
              value: l.location_name,
              label: l.location_name,
            })),
          ]}
        />
      </div>

      {/* Row 3: Department Select (Full Width with Small-Caps Mono Label) */}
      <div className="pt-2 border-t border-hairline flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-muted whitespace-nowrap font-medium">
          Department:
        </span>
        <div className="flex-1">
          <Select
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            options={[
              { value: 'All', label: 'All Academic Departments' },
              ...DEPARTMENTS.map((d) => ({
                value: d,
                label: d,
              })),
            ]}
          />
        </div>
      </div>
    </div>
  );
};
