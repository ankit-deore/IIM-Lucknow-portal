'use client';

import { Megaphone, SearchX, CheckCircle } from 'lucide-react';
import { AnnouncementCard } from './AnnouncementCard';

interface AnnouncementFeedProps {
  announcements: any[];
  loading: boolean;
  statusFilter: 'all' | 'unread';
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onMarkRead: (id: string) => void;
  onOpenDetail: (announcement: any) => void;
}

export function AnnouncementFeed({ 
  announcements, loading, statusFilter, hasActiveFilters, 
  onClearFilters, onMarkRead, onOpenDetail 
}: AnnouncementFeedProps) {

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-border rounded-lg p-6 shadow-sm animate-pulse">
            <div className="flex gap-2 mb-4">
              <div className="h-5 w-16 bg-surface rounded"></div>
              <div className="h-5 w-12 bg-surface rounded"></div>
            </div>
            <div className="h-6 w-3/4 bg-surface rounded mb-3"></div>
            <div className="h-4 w-full bg-surface rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-surface rounded mb-4"></div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
              <div className="h-4 w-32 bg-surface rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (announcements.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="bg-white border border-border rounded-lg shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <SearchX className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-text-primary mb-1">No announcements match your filters</h3>
          <p className="text-text-secondary max-w-sm mb-4">
            Try adjusting or clearing your filters to see more results.
          </p>
          <button onClick={onClearFilters} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Clear filters
          </button>
        </div>
      );
    }
    
    if (statusFilter === 'unread') {
      return (
        <div className="bg-white border border-border rounded-lg shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-12 h-12 text-success mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-1">You're all caught up</h3>
          <p className="text-text-secondary max-w-sm">
            No unread announcements. Check back later for updates.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-border rounded-lg shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <Megaphone className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-text-primary mb-1">No announcements yet</h3>
        <p className="text-text-secondary max-w-sm">
          Your programme admin hasn't posted anything yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <AnnouncementCard 
          key={announcement.id} 
          announcement={announcement} 
          onClick={() => onOpenDetail(announcement)}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
}
