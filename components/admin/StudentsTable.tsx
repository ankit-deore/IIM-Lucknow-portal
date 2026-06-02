'use client';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Edit2, Mail, Ban, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Student {
  id: string;
  name: string | null;
  email: string;
  status: 'ACTIVE' | 'DORMANT' | 'DEACTIVATED';
  lastLogin: Date | null;
  profile: {
    programme: string | null;
    batch: string | null;
  } | null;
}

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onResendInvite: (studentId: string) => void;
  onDeactivate: (student: Student) => void;
  onReactivate: (student: Student) => void;
}

export function StudentsTable({ students, onEdit, onResendInvite, onDeactivate, onReactivate }: StudentsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (students.length === 0) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-sm p-12 text-center">
        <h3 className="text-lg font-medium text-text-primary mb-2">No students found.</h3>
        <p className="text-text-secondary">Upload a CSV or add students manually to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface text-text-secondary uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Name & Email</th>
              <th className="px-6 py-4 font-medium">Programme</th>
              <th className="px-6 py-4 font-medium">Batch</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Last Login</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map(student => {
              const isDeactivated = student.status === 'DEACTIVATED';
              const isDormant = student.status === 'DORMANT';
              
              return (
                <tr 
                  key={student.id} 
                  className={`group transition-colors hover:bg-surface/50 cursor-pointer ${
                    isDeactivated ? 'opacity-60' : ''
                  } ${isDormant ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-transparent'}`}
                  onClick={(e) => {
                    // Prevent triggering edit if clicking the action menu
                    if (!(e.target as HTMLElement).closest('.action-menu-container')) {
                      onEdit(student);
                    }
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-text-primary">{student.name || 'Unknown'}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{student.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {student.profile?.programme ? (
                      <span className="inline-flex px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold">
                        {student.profile.programme}
                      </span>
                    ) : (
                      <span className="text-text-secondary">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-text-primary">{student.profile?.batch || '-'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {student.lastLogin ? formatDistanceToNow(new Date(student.lastLogin), { addSuffix: true }) : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right action-menu-container relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === student.id ? null : student.id);
                      }}
                      className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-full transition-colors focus:outline-none"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === student.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                        />
                        <div className="absolute right-6 top-10 w-48 bg-white rounded-md shadow-lg border border-border z-20 py-1 text-left">
                          <button
                            onClick={() => { setOpenMenuId(null); onEdit(student); }}
                            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          
                          {student.status === 'DORMANT' && (
                            <button
                              onClick={() => { setOpenMenuId(null); onResendInvite(student.id); }}
                              className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface flex items-center gap-2"
                            >
                              <Mail className="w-4 h-4" /> Resend Invite
                            </button>
                          )}
                          
                          {student.status !== 'DEACTIVATED' ? (
                            <button
                              onClick={() => { setOpenMenuId(null); onDeactivate(student); }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-border mt-1 pt-2"
                            >
                              <Ban className="w-4 h-4" /> Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => { setOpenMenuId(null); onReactivate(student); }}
                              className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2 border-t border-border mt-1 pt-2"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Reactivate
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
