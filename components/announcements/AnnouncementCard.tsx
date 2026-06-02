'use client';

import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Pin, Check } from 'lucide-react';
import { AnnouncementTypeBadge } from '@/components/admin/AnnouncementsTable';

interface AnnouncementCardProps {
  announcement: any;
  onClick: () => void;
  onMarkRead: (id: string) => void;
}

// Helper to extract text from HTML for preview
const extractText = (html: string) => {
  if (typeof window === 'undefined') return html.replace(/<[^>]+>/g, '').substring(0, 160);
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

export function AnnouncementCard({ announcement, onClick, onMarkRead }: AnnouncementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMarkedRead, setHasMarkedRead] = useState(announcement.isRead);

  // Auto-mark as read logic
  useEffect(() => {
    if (hasMarkedRead) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.5 } // 50% of the card must be visible
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [hasMarkedRead]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isVisible && !hasMarkedRead) {
      timeout = setTimeout(() => {
        setHasMarkedRead(true);
        onMarkRead(announcement.id);
      }, 2000); // 2 seconds
    }
    return () => clearTimeout(timeout);
  }, [isVisible, hasMarkedRead, announcement.id, onMarkRead]);

  const previewText = extractText(announcement.body);
  const isTruncated = previewText.length > 160;

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className={`relative group bg-white border rounded-lg p-5 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        !announcement.isRead ? 'border-l-4 border-l-primary border-y-border border-r-border' : 'border-border'
      }`}
    >
      {announcement.isPinned && (
        <div className="absolute top-4 right-4 text-accent" title="Pinned">
          <Pin size={18} fill="currentColor" />
        </div>
      )}

      <div className="flex flex-col gap-4 pr-6 sm:pr-8">
        {/* Top row */}
        <div className="flex flex-wrap items-center gap-2">
          <AnnouncementTypeBadge type={announcement.type} />
          {announcement.targetProgrammes?.map((prog: string) => (
            <span key={prog} className="px-2 py-0.5 bg-surface text-text-secondary rounded text-xs font-medium border border-border/50">
              {prog}
            </span>
          ))}
          <span 
            className="text-xs text-text-secondary ml-auto md:ml-2" 
            title={new Date(announcement.createdAt).toLocaleString()}
          >
            {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-lg text-text-primary ${!announcement.isRead ? 'font-bold' : 'font-medium opacity-90'}`}>
          {announcement.title}
        </h3>

        {/* Body preview */}
        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
          {previewText.substring(0, 160)}
          {isTruncated && '... '}
          {isTruncated && <span className="text-primary hover:underline">Read more</span>}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
          <div className="text-xs text-text-secondary">
            Posted by <span className="font-medium text-text-primary">{announcement.author?.name || 'Admin'}</span>
          </div>
          
          {!announcement.isRead && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (!hasMarkedRead) {
                  setHasMarkedRead(true);
                  onMarkRead(announcement.id);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/5"
            >
              <Check size={14} />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
