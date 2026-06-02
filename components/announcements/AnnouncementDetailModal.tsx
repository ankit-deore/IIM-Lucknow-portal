'use client';

import { X } from 'lucide-react';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';
import { AnnouncementTypeBadge } from '@/components/admin/AnnouncementsTable';

interface AnnouncementDetailModalProps {
  announcement: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AnnouncementDetailModal({ announcement, isOpen, onClose }: AnnouncementDetailModalProps) {
  if (!isOpen || !announcement) return null;

  const isExpiringSoon = false; // Add logic if needed: diffInDays(new Date(announcement.expiryDate), new Date()) <= 7

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-[680px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 pb-4 border-b border-border">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AnnouncementTypeBadge type={announcement.type} />
              {announcement.targetProgrammes?.map((prog: string) => (
                <span key={prog} className="px-2 py-0.5 bg-surface text-text-secondary rounded text-xs font-medium border border-border/50">
                  {prog}
                </span>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-text-primary leading-tight">{announcement.title}</h2>
            <div className="text-sm text-text-secondary">
              <span className="font-medium text-text-primary">Posted by {announcement.author?.name || 'Admin'}</span>
              <span className="mx-2">•</span>
              {format(new Date(announcement.createdAt), 'MMMM d, yyyy h:mm a')}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 -mt-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-full transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div 
            className="prose prose-sm md:prose-base max-w-none text-text-primary
              prose-p:mb-4 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:font-bold prose-strong:text-text-primary
              prose-ul:list-disc prose-ol:list-decimal prose-li:my-1
              prose-headings:text-text-primary prose-headings:font-bold"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.body) }}
          />
        </div>

        {(announcement.isPinned || announcement.expiryDate) && (
          <div className="px-6 py-3 bg-surface/50 border-t border-border flex flex-col gap-1">
            {announcement.isPinned && (
              <div className="text-xs text-text-secondary font-medium">
                📌 Pinned by admin
              </div>
            )}
            {announcement.expiryDate && (
              <div className="text-xs text-amber-600 font-medium">
                ⏱️ This announcement expires on {format(new Date(announcement.expiryDate), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
