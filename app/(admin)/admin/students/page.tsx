'use client';

import { useState, useEffect, useCallback } from 'react';
import { StudentsTable } from '@/components/admin/StudentsTable';
import { CsvUploadModal } from '@/components/admin/CsvUploadModal';
import { StudentFormModal } from '@/components/admin/StudentFormModal';
import { Search, Upload, UserPlus, FilterX } from 'lucide-react';
import { PROGRAMMES } from '@/constants/programmes';
import { toastSuccess, toastError } from '@/lib/toast';

export default function StudentManagementPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [programme, setProgramme] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Modals
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(programme && { programme }),
        ...(status && { status }),
      });
      const res = await fetch(`/api/admin/students?${query.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setStudents(data.data.students);
        setTotal(data.data.meta.total);
      } else {
        toastError('Failed to fetch students');
      }
    } catch (error) {
      toastError('Network error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, programme, status]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleResendInvite = async (studentId: string) => {
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend_invite' }),
      });
      if (res.ok) {
        toastSuccess('Invite resent successfully');
        fetchStudents();
      } else {
        const err = await res.json();
        toastError(err.error?.message || 'Failed to resend invite');
      }
    } catch (e) {
      toastError('Network error');
    }
  };

  const handleDeactivate = async (student: any) => {
    if (!confirm(`Deactivate ${student.name || student.email}? They will immediately lose access to Gurukul.`)) return;
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deactivate' }),
      });
      if (res.ok) {
        toastSuccess('Account deactivated');
        fetchStudents();
      } else {
        toastError('Failed to deactivate account');
      }
    } catch (e) {
      toastError('Network error');
    }
  };

  const handleReactivate = async (student: any) => {
    if (!confirm(`Reactivate ${student.name || student.email}? They will regain access on their next login.`)) return;
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reactivate' }),
      });
      if (res.ok) {
        toastSuccess('Account reactivated');
        fetchStudents();
      } else {
        toastError('Failed to reactivate account');
      }
    } catch (e) {
      toastError('Network error');
    }
  };

  const totalPages = Math.ceil(total / limit);
  const hasFilters = search !== '' || programme !== '' || status !== '';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Student Management</h2>
          <p className="text-text-secondary mt-1 flex items-center gap-2">
            <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full text-xs">
              {total} total
            </span>
            Manage student access and profiles
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border rounded-md text-sm font-medium text-text-primary hover:bg-surface transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload CSV
          </button>
          <button
            onClick={() => { setEditingStudent(null); setIsFormModalOpen(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-border shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <select
            value={programme}
            onChange={(e) => { setProgramme(e.target.value); setPage(1); }}
            className="flex-1 md:w-40 px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-primary"
          >
            <option value="">All Programmes</option>
            {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="flex-1 md:w-40 px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DORMANT">Dormant</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={() => {
              setSearch('');
              setProgramme('');
              setStatus('');
              setPage(1);
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-red-500 transition-colors md:px-2"
          >
            <FilterX className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <StudentsTable 
            students={students}
            onEdit={(student) => { setEditingStudent(student); setIsFormModalOpen(true); }}
            onResendInvite={handleResendInvite}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivate}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 text-sm text-text-secondary">
              <p>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries</p>
              <div className="flex gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 border border-border rounded hover:bg-surface disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 border border-border rounded hover:bg-surface disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CsvUploadModal 
        isOpen={isCsvModalOpen} 
        onClose={() => setIsCsvModalOpen(false)} 
        onSuccess={() => { setIsCsvModalOpen(false); fetchStudents(); }}
      />
      
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setEditingStudent(null); }}
        onSuccess={() => { setIsFormModalOpen(false); fetchStudents(); }}
        student={editingStudent}
      />
    </div>
  );
}
