'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { ProfilePanel } from '@/components/profile/ProfilePanel';

export function AppBar() {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleOpenProfile = () => setIsProfileOpen(true);
    window.addEventListener('open-profile-panel', handleOpenProfile);
    return () => window.removeEventListener('open-profile-panel', handleOpenProfile);
  }, []);

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Account';
  const initial = firstName[0]?.toUpperCase() || 'U';

  return (
    <>
      <header className="flex h-16 items-center justify-end border-b border-[var(--color-border)] bg-white px-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-sm font-medium text-[var(--color-text-primary)]">{firstName}</span>
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary)] text-white shadow-sm">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-medium">{initial}</span>
              )}
            </div>
          </button>
          
          <div className="w-px h-6 bg-[var(--color-border)]" />
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-[var(--color-text-secondary)] hover:text-red-600 transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <ProfilePanel 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
}
