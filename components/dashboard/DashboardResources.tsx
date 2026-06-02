'use client';

import Link from 'next/link';
import { FolderOpen, ExternalLink, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function DashboardResources() {
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.resource) {
          setResource(data.data.resource);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 min-h-[320px] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-[18px] h-[18px] text-[var(--color-primary)]" />
          <h2 className="text-[16px] font-bold text-[var(--color-primary)]">
            Resources
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {loading ? (
          <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin opacity-50" />
        ) : resource?.driveUrl ? (
          <>
            <FolderOpen className="w-10 h-10 text-[var(--color-primary)] opacity-80 mb-3" />
            <h3 className="text-[16px] font-bold text-[var(--color-text-primary)]">
              {resource.programme} Resources
            </h3>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1.5 mb-4">
              Access your official course materials and study resources
            </p>
            <a 
              href={resource.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-[13px] font-medium px-4 py-2 rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Open Google Drive
              <ExternalLink className="w-4 h-4" />
            </a>
          </>
        ) : (
          <>
            <FolderOpen className="w-10 h-10 text-[var(--color-text-secondary)] opacity-40 mb-3" />
            <h3 className="text-[16px] font-bold text-[var(--color-text-secondary)]">Resources</h3>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1.5">
              Course materials and study resources
            </p>
            <span className="mt-3 bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] text-[12px] font-medium px-3 py-1 rounded-full">
              Coming soon
            </span>
          </>
        )}
      </div>
    </div>
  );
}
