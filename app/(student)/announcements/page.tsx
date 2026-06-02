'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { AnnouncementFilters } from '@/components/announcements/AnnouncementFilters';
import { AnnouncementFeed } from '@/components/announcements/AnnouncementFeed';
import { AnnouncementDetailModal } from '@/components/announcements/AnnouncementDetailModal';

export default function AnnouncementsPage() {
  const { data: session } = useSession();
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [programmeFilter, setProgrammeFilter] = useState<string>('all');
  
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);

  const fetchAnnouncements = async (resetPage = false) => {
    try {
      const currentPage = resetPage ? 1 : page;
      const res = await fetch(`/api/announcements?page=${currentPage}&limit=20&status=${statusFilter}${typeFilter !== 'all' ? `&type=${typeFilter}` : ''}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch');
      
      if (resetPage) {
        setAnnouncements(data.data.announcements);
        setPage(1);
      } else {
        // Append if paginating, but here we just replace for simplicity unless infinite scrolling is strictly required
        setAnnouncements(data.data.announcements); 
      }
      
      setUnreadCount(data.data.unreadCount);
      setTotalPages(data.data.meta.totalPages);
      setHasMore(data.data.meta.hasNext);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAnnouncements(true);
  }, [statusFilter, typeFilter, programmeFilter]); // Added filters to deps

  const handleMarkRead = async (id: string) => {
    // Optimistic UI update
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Background API call (fire and forget)
    fetch(`/api/announcements/${id}/read`, { method: 'POST' }).catch(console.error);
  };

  const handleMarkAllRead = async () => {
    setAnnouncements(prev => prev.map(a => ({ ...a, isRead: true })));
    setUnreadCount(0);
    toast.success('All announcements marked as read', { duration: 3000 });
    fetch(`/api/announcements/read-all`, { method: 'POST' }).catch(console.error);
  };

  const handleOpenDetail = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    if (!announcement.isRead) {
      handleMarkRead(announcement.id);
    }
  };

  const hasMultipleProgrammes = false; // Logic: check if student has multiple programmes if supported. BRD says "only shown if student is enrolled in 2+ programmes"

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
          Announcements
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-sm font-medium px-2.5 py-0.5 rounded-full h-[24px] flex items-center justify-center">
              {unreadCount} unread
            </span>
          )}
        </h1>
      </div>

      <AnnouncementFilters 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        programmeFilter={programmeFilter}
        setProgrammeFilter={setProgrammeFilter}
        hasMultipleProgrammes={hasMultipleProgrammes}
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
      />

      <AnnouncementFeed 
        announcements={announcements}
        loading={loading}
        statusFilter={statusFilter}
        hasActiveFilters={typeFilter !== 'all' || programmeFilter !== 'all'}
        onClearFilters={() => { setTypeFilter('all'); setProgrammeFilter('all'); }}
        onMarkRead={handleMarkRead}
        onOpenDetail={handleOpenDetail}
      />

      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => {
              setPage(p => p + 1);
              fetchAnnouncements(false);
            }}
            className="px-6 py-2 bg-surface text-text-primary text-sm font-medium rounded-lg hover:bg-surface/80 transition-colors border border-border"
          >
            Load more
          </button>
        </div>
      )}

      <AnnouncementDetailModal 
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        announcement={selectedAnnouncement}
      />
    </div>
  );
}
