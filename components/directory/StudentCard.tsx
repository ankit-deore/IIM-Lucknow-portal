'use client';

import { useSession } from 'next-auth/react';

interface StudentCardProps {
  student: {
    id: string;
    name: string | null;
    image: string | null;
    profile: {
      programme: string | null;
      batch: string | null;
      currentRole: string | null;
      company: string | null;
      industry: string | null;
      photoUrl: string | null;
      profileComplete: boolean;
    } | null;
  };
  onClick: () => void;
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  // Mix with a base color to ensure it's not too light/unreadable
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

function getInitials(name: string) {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function StudentCard({ student, onClick }: StudentCardProps) {
  const { data: session } = useSession();
  const isOwnProfile = session?.user?.id === student.id;

  const name = student.name || 'Unknown Student';
  const avatarColor = getAvatarColor(name);
  const initials = getInitials(name);
  const photoUrl = student.profile?.photoUrl || student.image;

  let roleCompanyText = '';
  if (student.profile?.currentRole && student.profile?.company) {
    roleCompanyText = `${student.profile.currentRole} · ${student.profile.company}`;
  } else if (student.profile?.currentRole) {
    roleCompanyText = student.profile.currentRole;
  } else if (student.profile?.company) {
    roleCompanyText = student.profile.company;
  }

  return (
    <div 
      onClick={onClick}
      className="relative flex flex-col h-[220px] w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-primary-light)] hover:-translate-y-[2px] transition-all cursor-pointer overflow-hidden"
    >
      {/* Row 1: Avatar + Programme */}
      <div className="flex items-start justify-between w-full">
        <div className="relative">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div 
              className="w-12 h-12 rounded-full text-white flex items-center justify-center text-[16px] font-bold"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>
          )}
          {isOwnProfile && (
            <div className="absolute -top-2 -left-2 bg-[var(--color-accent)] text-white text-[11px] font-bold rounded-full px-2 py-0.5 border border-white">
              You
            </div>
          )}
        </div>
        
        {student.profile?.programme && (
          <div className="bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[12px] font-semibold rounded-full px-2.5 py-[3px]">
            {student.profile.programme}
          </div>
        )}
      </div>

      {/* Row 2: Name */}
      <h3 className="mt-3 text-[16px] font-bold text-[var(--color-text-primary)] truncate" title={name}>
        {name}
      </h3>

      {/* Row 3: Role & Company */}
      <div className="mt-1 flex-1 overflow-hidden">
        {roleCompanyText ? (
          <p className="text-[13px] text-[var(--color-text-secondary)] line-clamp-2" title={roleCompanyText}>
            {roleCompanyText}
          </p>
        ) : (
          <p className="text-[13px] text-[var(--color-text-secondary)] italic">
            Profile not yet complete
          </p>
        )}
      </div>

      {/* Row 4: Batch tag */}
      <div className="mt-auto pt-2 w-full">
        {student.profile?.batch && (
          <p className="text-[12px] text-[var(--color-text-secondary)]">
            Batch {student.profile.batch}
          </p>
        )}
      </div>
    </div>
  );
}
