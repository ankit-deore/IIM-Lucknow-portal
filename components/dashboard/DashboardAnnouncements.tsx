'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AnnouncementTypeBadge } from '@/components/admin/AnnouncementsTable';

export function DashboardAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements?limit=5')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.announcements) {
          setAnnouncements(data.data.announcements);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = announcements.filter(a => !a.isRead).length;

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 min-h-[320px] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-[18px] h-[18px] text-[var(--color-primary)]" />
          <h2 className="text-[16px] font-bold text-[var(--color-primary)] flex items-center gap-2">
            Announcements
            {unreadCount > 0 && (
              <span className="bg-[var(--color-primary)] text-white rounded-full h-[18px] px-2 text-[12px] flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>
        <Link 
          href="/announcements"
          className="text-[13px] text-[var(--color-primary)] hover:underline font-medium"
        >
          View all &rarr;
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex items-start gap-4">
                <div className="h-6 w-16 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                </div>
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
            <Megaphone className="w-8 h-8 mb-2 opacity-60" />
            <p className="text-[14px]">No announcements yet.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {announcements.map((announcement, index) => {
              const isLast = index === announcements.length - 1;
              const isUnread = !announcement.isRead;
              const title = announcement.title.length > 55 
                ? announcement.title.substring(0, 55) + '...' 
                : announcement.title;

              return (
                <Link
                  href="/announcements" // Since we don't have the modal yet in this component scope, navigate to announcements page
                  key={announcement.id}
                  className={`flex justify-between items-start py-2.5 px-2 -mx-2 hover:bg-[var(--color-bg-subtle)] hover:rounded-[var(--radius-sm)] transition-colors cursor-pointer ${
                    !isLast ? 'border-b border-[var(--color-border)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5 max-w-[80%]">
                    {isUnread ? (
                      <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] flex-shrink-0 mt-2" />
                    ) : (
                      <div className="w-2 flex-shrink-0" /> // Spacer
                    )}
                    
                    <div className="flex items-center flex-shrink-0 mt-0.5">
                      <AnnouncementTypeBadge type={announcement.type} />
                    </div>
                    
                    <span className={`text-[14px] leading-snug break-words ${isUnread ? 'font-semibold text-[var(--color-text-primary)]' : 'font-normal text-[var(--color-text)]'}`}>
                      {title}
                    </span>
                  </div>
                  
                  <span className="text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap pt-0.5">
                    {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
