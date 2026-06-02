'use client';

import { useState, useCallback } from 'react';
import { DirectoryFilters, type DirectoryFiltersState } from '@/components/directory/DirectoryFilters';
import { StudentGrid } from '@/components/directory/StudentGrid';

export default function DirectoryPage() {
  const [filters, setFilters] = useState<DirectoryFiltersState>({
    search: '',
    programme: 'All Programmes',
    batch: 'All Batches',
    industry: 'All Industries'
  });

  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [distinctBatches, setDistinctBatches] = useState<string[]>([]);

  const handleDataLoaded = useCallback((total: number, batches: string[]) => {
    setTotalStudents(total);
    setDistinctBatches(batches);
  }, []);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      programme: 'All Programmes',
      batch: 'All Batches',
      industry: 'All Industries'
    });
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-[22px] font-bold text-[var(--color-text-primary)]">
          Student Directory
        </h1>
        <span className="bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] px-3 py-1 rounded-full text-[13px] font-medium">
          {totalStudents} students
        </span>
      </div>

      {/* Filters */}
      <DirectoryFilters 
        filters={filters} 
        setFilters={setFilters} 
        distinctBatches={distinctBatches} 
      />

      {/* Grid */}
      <StudentGrid 
        filters={filters} 
        onDataLoaded={handleDataLoaded} 
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
