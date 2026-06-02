'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState<any>(null);
  
  const [currentRole, setCurrentRole] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [workExperience, setWorkExperience] = useState('');

  const industries = [
    'Consulting', 'Technology', 'Finance', 'Healthcare', 'Manufacturing', 
    'FMCG', 'Energy', 'Education', 'Government', 'Other'
  ];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/user/me')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data?.profile) {
            const p = data.data.profile;
            setProfile(data.data);
            setCurrentRole(p.currentRole || '');
            setCompany(p.company || '');
            setIndustry(p.industry || '');
            setWorkExperience(p.workExperience || '');
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Account';
  const initial = firstName[0]?.toUpperCase() || 'U';

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/complete-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRole,
          company,
          industry,
          workExperience
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to save');
      
      toast.success('Profile updated.');
      onClose();
    } catch (err) {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-250 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col">
          <div className="flex flex-col items-center mb-8">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="w-16 h-16 rounded-full object-cover mb-3" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-bold mb-3">
                {initial}
              </div>
            )}
            <h2 className="text-[20px] font-bold text-[var(--color-primary)]">{session?.user?.name}</h2>
            {profile?.profile?.programme && profile?.profile?.batch && (
              <div className="mt-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-semibold">
                {profile.profile.programme} · {profile.profile.batch}
              </div>
            )}
          </div>

          <div className="bg-[var(--color-bg-subtle)] rounded-[var(--radius-md)] p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-[var(--color-text-secondary)]">
              <Lock size={14} />
              <span className="text-xs font-semibold uppercase tracking-wider">Managed by your programme office</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Full Name</span>
                <span className="font-medium text-[var(--color-text)]">{session?.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Date of Birth</span>
                <span className="font-medium text-[var(--color-text)]">
                  {profile?.profile?.dob ? new Date(profile.profile.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Programme</span>
                <span className="font-medium text-[var(--color-text)]">{profile?.profile?.programme || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Batch</span>
                <span className="font-medium text-[var(--color-text)]">{profile?.profile?.batch || '-'}</span>
              </div>
            </div>
          </div>

          <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] mb-4">Edit your details</h3>
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Current Role</label>
              <input 
                type="text" 
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value)}
                placeholder="e.g. Senior Manager"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Company</label>
              <input 
                type="text" 
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Tata Consultancy"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Industry</label>
              <select 
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-sm bg-white"
              >
                <option value="" disabled>Select an industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Work Experience</label>
              <textarea 
                value={workExperience}
                onChange={e => setWorkExperience(e.target.value.substring(0, 300))}
                placeholder="Brief professional summary"
                rows={4}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-sm resize-none"
              />
              <div className="text-right text-xs text-[var(--color-text-secondary)] mt-1">
                {workExperience.length}/300
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full h-12 mt-6 rounded-full bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-70 flex items-center justify-center"
          >
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}
