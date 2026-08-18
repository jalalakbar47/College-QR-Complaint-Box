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
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-subtle mb-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filter & Search Grievances</span>
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search Box */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Search by ID, keyword, student name..."
            leftIcon={<Search className="w-4 h-4" />}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>

        {/* Status Filter */}
        <div>
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
        </div>

        {/* Priority Filter */}
        <div>
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
        </div>

        {/* Category Filter */}
        <div>
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
        </div>

        {/* Location Filter */}
        <div>
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

        {/* Department Filter */}
        <div className="sm:col-span-2 lg:col-span-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Department:</span>
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
      </div>
    </div>
  );
};
