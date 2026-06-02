'use client';

import { format } from 'date-fns';
import { Pin, Edit2, Trash2, Megaphone } from 'lucide-react';
import { ANNOUNCEMENT_TYPE_LABELS, ANNOUNCEMENT_TYPE_COLOURS } from '@/constants/announcement';

export function AnnouncementTypeBadge({ type }: { type: 'GENERAL' | 'URGENT' | 'EVENT' }) {
  const colours = ANNOUNCEMENT_TYPE_COLOURS[type];
  const label = ANNOUNCEMENT_TYPE_LABELS[type];
  return (
    <span 
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: colours.bg, color: colours.text }}
    >
      {label}
    </span>
  );
}

interface AnnouncementsTableProps {
  announcements: any[];
  onEdit: (announcement: any) => void;
  onDelete: (announcement: any) => void;
  loading?: boolean;
}

export function AnnouncementsTable({ announcements, onEdit, onDelete, loading }: AnnouncementsTableProps) {
  if (loading) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-sm p-12 text-center text-text-secondary">
        Loading announcements...
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <Megaphone className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-text-primary mb-1">No announcements published yet</h3>
        <p className="text-text-secondary max-w-sm">
          Create your first announcement to share updates, events, or important information with students.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface text-text-secondary uppercase">
            <tr>
              <th className="px-6 py-3 font-medium w-10"></th>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Target</th>
              <th className="px-6 py-3 font-medium">Published</th>
              <th className="px-6 py-3 font-medium">Expires</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => {
              const isExpired = announcement.isExpired;
              return (
                <tr 
                  key={announcement.id} 
                  className={`border-b border-border last:border-0 hover:bg-surface/50 transition-colors ${
                    isExpired ? 'opacity-60 bg-gray-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-center">
                    {announcement.isPinned ? <Pin size={16} className="text-accent inline" /> : <span className="text-text-secondary">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-medium text-text-primary ${isExpired ? 'line-through' : ''}`} title={announcement.title}>
                      {announcement.title.length > 60 ? announcement.title.substring(0, 60) + '...' : announcement.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <AnnouncementTypeBadge type={announcement.type} />
                  </td>
                  <td className="px-6 py-4">
                    {announcement.targetProgrammes.length === 0 ? (
                      <span className="text-text-secondary">All</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {announcement.targetProgrammes.map((p: string) => (
                          <span key={p} className="px-2 py-0.5 bg-surface text-text-secondary rounded text-xs">{p}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {format(new Date(announcement.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {announcement.expiryDate ? format(new Date(announcement.expiryDate), 'MMM d, yyyy') : 'No expiry'}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button 
                      onClick={() => onEdit(announcement)}
                      className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded transition-colors mr-1"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(announcement)}
                      className="p-1.5 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
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
