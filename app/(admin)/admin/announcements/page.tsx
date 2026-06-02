'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AnnouncementsTable } from '@/components/admin/AnnouncementsTable';
import { AnnouncementFormModal } from '@/components/admin/AnnouncementFormModal';
import toast from 'react-hot-toast';

export default function AdminAnnouncementsPage() {
  const [tab, setTab] = useState<'published' | 'expired' | 'all'>('published');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/announcements?tab=${tab}&page=${page}&limit=20`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch');
      
      setAnnouncements(data.data.announcements);
      setTotalPages(data.data.meta.totalPages);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [tab, page]);

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = async (announcement: any) => {
    if (confirm(`Delete announcement "${announcement.title}"?\nThis will immediately remove it from all student feeds.`)) {
      try {
        const res = await fetch(`/api/admin/announcements/${announcement.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Failed to delete');
        
        toast.success('Announcement deleted');
        fetchAnnouncements();
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Announcement Manager</h1>
          <p className="text-text-secondary text-sm mt-1">Create and manage broadcast messages for students.</p>
        </div>
        <button 
          onClick={() => { setEditingAnnouncement(null); setIsModalOpen(true); }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} />
          New Announcement
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="flex border-b border-border bg-surface/50">
          {(['published', 'expired', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                tab === t 
                  ? 'border-primary text-primary bg-white' 
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-0">
          <AnnouncementsTable 
            announcements={announcements} 
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex justify-between items-center bg-surface/30">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-text-secondary">Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <AnnouncementFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchAnnouncements();
        }}
        announcement={editingAnnouncement}
      />
    </div>
  );
}
