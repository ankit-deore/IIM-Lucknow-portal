'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const pageTitles: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/announcements': 'Announcements',
  '/admin/timetable': 'Timetable',
  '/admin/resources': 'Resources',
  '/admin/audit-log': 'Audit Log',
  '/admin/settings': 'Admin Settings',
};

export function AdminTopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleOpenProfile = () => setIsProfileOpen(true);
    window.addEventListener('open-profile-panel', handleOpenProfile);
    return () => window.removeEventListener('open-profile-panel', handleOpenProfile);
  }, []);
  
  const exactMatch = pageTitles[pathname];
  const prefixMatch = Object.keys(pageTitles).filter(k => k !== '/admin' && pathname.startsWith(k))[0];
  const title = exactMatch || (prefixMatch ? pageTitles[prefixMatch] : 'Admin Panel');

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Admin';
  const initial = firstName[0]?.toUpperCase() || 'A';

  return (
    <header className="h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h2 className="text-[20px] font-bold text-[var(--color-text-primary)]">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[var(--color-primary)] border border-[var(--color-primary)] px-4 py-1.5 rounded-full text-[13px] font-semibold hover:bg-[var(--color-primary-light)] transition-colors"
        >
          <Eye className="w-4 h-4" />
          View as Student
        </Link>
        
        <div className="w-px h-6 bg-[var(--color-border)]" />
        
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-[var(--color-text-primary)]">{firstName}</span>
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary)] text-white shadow-sm">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Admin Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-medium">{initial}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
