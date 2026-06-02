'use client';

import { useState, useEffect } from 'react';
import { SearchX, Users } from 'lucide-react';
import { StudentCard } from './StudentCard';
import { ProfileModal } from './ProfileModal';
import type { DirectoryFiltersState } from './DirectoryFilters';

interface StudentGridProps {
  filters: DirectoryFiltersState;
  onDataLoaded: (total: number, distinctBatches: string[]) => void;
  onClearFilters: () => void;
}

export function StudentGrid({ filters, onDataLoaded, onClearFilters }: StudentGridProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, hasNext: false, hasPrev: false });
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '24',
    });

    if (filters.search) params.set('search', filters.search);
    if (filters.programme !== 'All Programmes') params.set('programme', filters.programme);
    if (filters.batch !== 'All Batches') params.set('batch', filters.batch);
    if (filters.industry !== 'All Industries') params.set('industry', filters.industry);

    fetch(`/api/directory?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudents(data.data.students);
          setMeta(data.data.meta);
          onDataLoaded(data.data.meta.total, data.data.distinctBatches);
        } else {
          setError(data.error?.message || 'Failed to load directory');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch data');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => setPage(1)} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded">
          Try Again
        </button>
      </div>
    );
  }

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.programme !== 'All Programmes' || 
    filters.batch !== 'All Batches' || 
    filters.industry !== 'All Industries';

  return (
    <div>
      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[220px] w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 animate-pulse flex flex-col">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="w-16 h-6 bg-gray-200 rounded-full" />
              </div>
              <div className="w-3/4 h-5 bg-gray-200 rounded mt-4" />
              <div className="w-1/2 h-4 bg-gray-200 rounded mt-2" />
              <div className="w-1/4 h-4 bg-gray-200 rounded mt-auto" />
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          {hasActiveFilters ? (
            <>
              <SearchX className="w-12 h-12 text-[var(--color-text-secondary)] mb-4" />
              <h3 className="text-[16px] font-bold text-[var(--color-text-primary)] mb-1">No students match your search</h3>
              <p className="text-[14px] text-[var(--color-text-secondary)] mb-4">Try adjusting or clearing your filters.</p>
              <button 
                onClick={onClearFilters}
                className="px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] font-medium rounded hover:bg-[var(--color-primary-light)] transition-colors text-[14px]"
              >
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <Users className="w-12 h-12 text-[var(--color-text-secondary)] mb-4" />
              <h3 className="text-[16px] font-bold text-[var(--color-text-primary)] mb-1">No students yet</h3>
              <p className="text-[14px] text-[var(--color-text-secondary)]">Students will appear here once added by your admin.</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
          {students.map(student => (
            <StudentCard 
              key={student.id} 
              student={student} 
              onClick={() => setSelectedUserId(student.id)} 
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && meta.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={!meta.hasPrev}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border border-[var(--color-border)] bg-white rounded text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-[14px] text-[var(--color-text-secondary)]">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            disabled={!meta.hasNext}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border border-[var(--color-border)] bg-white rounded text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {selectedUserId && (
        <ProfileModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}
    </div>
  );
}
