'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getGreeting } from '@/lib/utils';
import { DashboardAnnouncements } from '@/components/dashboard/DashboardAnnouncements';
import { DashboardResources } from '@/components/dashboard/DashboardResources';
import { DashboardTimetable } from '@/components/dashboard/DashboardTimetable';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.profile) {
          setProfile(data.data.profile);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingProfile(false));
  }, []);

  const firstName = session?.user?.name?.split(' ')[0] ?? 'User';
  const greeting = getGreeting();

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[var(--color-text-primary)]">
          {greeting}, {firstName}
        </h1>
        
        <div className="mt-2 h-6 flex items-center">
          {loadingProfile ? (
            <div className="h-[22px] w-[100px] bg-gray-200 rounded-full animate-pulse" />
          ) : profile?.programme && profile?.batch ? (
            <span className="bg-[var(--color-primary-light)] text-[var(--color-primary)] px-[14px] py-1 rounded-full text-[13px] font-medium">
              {profile.programme} &middot; {profile.batch}
            </span>
          ) : null}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[65fr_35fr] gap-5">
        
        {/* Top Left: Announcements */}
        <div className="md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2">
          <DashboardAnnouncements />
        </div>
        
        {/* Top Right: Resources */}
        <div className="md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2">
          <DashboardResources />
        </div>
        
        {/* Bottom Full Width: Timetable */}
        <div className="col-span-1 md:col-span-2 md:row-start-2 md:row-end-3">
          <DashboardTimetable />
        </div>
        
      </div>
    </div>
  );
}
