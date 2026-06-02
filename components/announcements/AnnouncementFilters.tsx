'use client';

import { CheckCheck } from 'lucide-react';

interface AnnouncementFiltersProps {
  statusFilter: 'all' | 'unread';
  setStatusFilter: (v: 'all' | 'unread') => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  programmeFilter: string;
  setProgrammeFilter: (v: string) => void;
  hasMultipleProgrammes: boolean;
  unreadCount: number;
  onMarkAllRead: () => void;
}

const PROGRAMMES = ['IPMX', 'PGPSM', 'PGPWE', 'DGMP'];
const TYPES = ['GENERAL', 'URGENT', 'EVENT'];

export function AnnouncementFilters({
  statusFilter, setStatusFilter, typeFilter, setTypeFilter, 
  programmeFilter, setProgrammeFilter, hasMultipleProgrammes, 
  unreadCount, onMarkAllRead
}: AnnouncementFiltersProps) {

  const hasActiveFilters = typeFilter !== 'all' || programmeFilter !== 'all';

  const clearFilters = () => {
    setTypeFilter('all');
    setProgrammeFilter('all');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Tab Group */}
        <div className="flex bg-surface p-1 rounded-lg border border-border">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              statusFilter === 'all' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('unread')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              statusFilter === 'unread' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Type Dropdown */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
        >
          <option value="all">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
        </select>

        {/* Programme Dropdown (Optional) */}
        {hasMultipleProgrammes && (
          <select
            value={programmeFilter}
            onChange={(e) => setProgrammeFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            <option value="all">All Programmes</option>
            {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        )}

        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-text-secondary hover:text-primary transition-colors underline decoration-dotted">
            Clear
          </button>
        )}
      </div>

      {unreadCount > 0 && (
        <button
          onClick={onMarkAllRead}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary bg-white hover:bg-primary/5 border border-border hover:border-primary/20 rounded-lg transition-all"
        >
          <CheckCheck size={16} />
          Mark all as read
        </button>
      )}
    </div>
  );
}
