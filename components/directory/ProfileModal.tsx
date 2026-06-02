'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileModalProps {
  userId: string;
  onClose: () => void;
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

function getInitials(name: string) {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ProfileModal({ userId, onClose }: ProfileModalProps) {
  const { data: session } = useSession();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = session?.user?.id === userId;

  useEffect(() => {
    fetch(`/api/directory/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudent(data.data.student);
        } else {
          setError(data.error?.message || 'Failed to load profile');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-[var(--radius-lg)] p-8 max-w-[560px] w-full flex justify-center">
          <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-[var(--radius-lg)] p-8 max-w-[560px] w-full text-center">
          <p className="text-red-500 mb-4">{error || 'Student not found'}</p>
          <button onClick={onClose} className="text-[14px] px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            Close
          </button>
        </div>
      </div>
    );
  }

  const name = student.name || 'Unknown Student';
  const photoUrl = student.profile?.photoUrl || student.image;
  const avatarColor = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-white rounded-[var(--radius-lg)] p-[40px] max-w-[560px] w-full max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-[80px] h-[80px] rounded-full object-cover mb-4" />
          ) : (
            <div 
              className="w-[80px] h-[80px] rounded-full text-white flex items-center justify-center text-[28px] font-bold mb-4"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>
          )}
          
          <h2 className="text-[24px] font-bold text-[var(--color-primary)]">{name}</h2>
          
          {student.profile?.programme && student.profile?.batch && (
            <span className="mt-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] px-3 py-1 rounded-full text-[13px] font-medium">
              {student.profile.programme} &middot; Batch {student.profile.batch}
            </span>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8">
          {student.profile?.currentRole && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.05em] text-[var(--color-text-secondary)] mb-1">Current Role</p>
              <p className="text-[15px] text-[var(--color-text-primary)]">{student.profile.currentRole}</p>
            </div>
          )}
          {student.profile?.company && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.05em] text-[var(--color-text-secondary)] mb-1">Company</p>
              <p className="text-[15px] text-[var(--color-text-primary)]">{student.profile.company}</p>
            </div>
          )}
          {student.profile?.industry && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.05em] text-[var(--color-text-secondary)] mb-1">Industry</p>
              <p className="text-[15px] text-[var(--color-text-primary)]">{student.profile.industry}</p>
            </div>
          )}
          
          {student.profile?.workExperience && (
            <div className="md:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.05em] text-[var(--color-text-secondary)] mb-1">Work Experience</p>
              <p className="text-[15px] text-[var(--color-text-primary)] whitespace-pre-wrap">
                {student.profile.workExperience}
              </p>
            </div>
          )}
          
          {student.profile?.academicBackground && (
            <div className="md:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.05em] text-[var(--color-text-secondary)] mb-1">Academic Background</p>
              <p className="text-[15px] text-[var(--color-text-primary)] whitespace-pre-wrap">
                {student.profile.academicBackground}
              </p>
            </div>
          )}
        </div>

        <hr className="border-[var(--color-border)] mb-6" />

        {/* Admin Controlled Fields */}
        <div className="mb-8">
          <h3 className="text-[13px] font-bold text-[var(--color-text-secondary)] mb-3">Programme Details</h3>
          <div className="bg-[var(--color-bg-subtle)] rounded-[var(--radius-md)] p-[12px] space-y-2 text-[14px]">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Programme</span>
              <span className="font-medium text-[var(--color-text-primary)]">{student.profile?.programme || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Batch</span>
              <span className="font-medium text-[var(--color-text-primary)]">{student.profile?.batch || '-'}</span>
            </div>
            {student.profile?.dob && (
              <div className="flex justify-between border-t border-[var(--color-border)] pt-2 mt-2">
                <span className="text-[var(--color-text-secondary)]">Date of Birth</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {format(new Date(student.profile.dob), 'MMMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center">
          {isOwnProfile ? (
            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('open-profile-panel'));
              }}
              className="px-6 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] font-medium rounded-md hover:bg-[var(--color-primary-light)] transition-colors text-[14px]"
            >
              Edit your profile
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50 font-medium rounded-md transition-colors text-[14px]"
            >
              Close
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
