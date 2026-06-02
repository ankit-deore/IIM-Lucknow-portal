'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface DirectoryFiltersState {
  search: string;
  programme: string;
  batch: string;
  industry: string;
}

interface DirectoryFiltersProps {
  filters: DirectoryFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<DirectoryFiltersState>>;
  distinctBatches: string[];
}

const PROGRAMMES = ['All Programmes', 'IPMX', 'PGPSM', 'PGPWE', 'DGMP'];
const INDUSTRIES = [
  'All Industries',
  'Consulting', 'Technology', 'Finance', 'Healthcare', 'Manufacturing',
  'FMCG', 'Energy', 'Education', 'Government', 'Other'
];

export function DirectoryFilters({ filters, setFilters, distinctBatches }: DirectoryFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.programme !== 'All Programmes' || 
    filters.batch !== 'All Batches' || 
    filters.industry !== 'All Industries';

  const handleClearAll = () => {
    setSearchInput('');
    setFilters({
      search: '',
      programme: 'All Programmes',
      batch: 'All Batches',
      industry: 'All Industries'
    });
  };

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-[12px] items-center mb-6">
      
      {/* Search */}
      <div className="relative flex-grow w-full md:w-auto min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-[18px] w-[18px] text-[var(--color-text-secondary)]" />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or company..."
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[14px]"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      {/* Programme Dropdown */}
      <select
        value={filters.programme}
        onChange={(e) => setFilters(prev => ({ ...prev, programme: e.target.value }))}
        className="w-full md:w-auto py-2.5 px-3 bg-white border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[14px]"
      >
        {PROGRAMMES.map(prog => (
          <option key={prog} value={prog}>{prog}</option>
        ))}
      </select>

      {/* Batch Dropdown */}
      <select
        value={filters.batch}
        onChange={(e) => setFilters(prev => ({ ...prev, batch: e.target.value }))}
        className="w-full md:w-auto py-2.5 px-3 bg-white border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[14px]"
      >
        <option value="All Batches">All Batches</option>
        {distinctBatches.map(batch => (
          <option key={batch} value={batch}>{batch}</option>
        ))}
      </select>

      {/* Industry Dropdown */}
      <select
        value={filters.industry}
        onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
        className="w-full md:w-auto py-2.5 px-3 bg-white border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[14px]"
      >
        {INDUSTRIES.map(ind => (
          <option key={ind} value={ind}>{ind}</option>
        ))}
      </select>

      {/* Clear All */}
      {hasActiveFilters && (
        <button
          onClick={handleClearAll}
          className="text-[13px] text-[var(--color-primary)] hover:underline font-medium px-2 py-2"
        >
          Clear All Filters
        </button>
      )}

    </div>
  );
}
