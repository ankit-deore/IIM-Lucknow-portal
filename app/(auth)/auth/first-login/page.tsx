'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Lock } from 'lucide-react';

export default function FirstLoginPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const [formData, setFormData] = useState({
    currentRole: '',
    company: '',
    industry: '',
    workExperience: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // Fetch user profile
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, []);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.currentRole) newErrors.currentRole = 'Current Role is required';
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.workExperience) {
      newErrors.workExperience = 'Work experience summary is required';
    } else if (formData.workExperience.length > 300) {
      newErrors.workExperience = 'Maximum 300 characters allowed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/user/complete-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error('Failed to update profile');
      
      // Force next-auth to update token data
      await update();
      router.push('/dashboard');
    } catch (error) {
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const formatDate = (isoStr: string) => {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] p-4 py-12">
      <div className="w-full max-w-[600px] rounded-2xl border border-[var(--color-border)] bg-white p-8 md:p-12 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Step 1 of 1
          </div>
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[var(--color-primary)]" />
            <span className="text-xl font-bold text-[var(--color-primary)]">IIM Lucknow</span>
          </div>
          <h1 className="mb-2 text-[28px] font-bold text-[var(--color-text)]">Welcome to Gurukul</h1>
          <p className="text-[16px] text-[var(--color-text-secondary)]">
            Please review your details before entering the portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-xl bg-[var(--color-bg-subtle)] p-6">
            <div className="mb-4 flex items-center gap-2 text-[var(--color-text-secondary)]">
              <Lock size={16} />
              <span className="text-sm font-medium">Set by your programme office</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Full Name</label>
                <div className="text-sm font-medium text-[var(--color-text)]">{session?.user?.name || '-'}</div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Programme</label>
                <div className="text-sm font-medium text-[var(--color-text)]">{profile?.programme || '-'}</div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Batch</label>
                <div className="text-sm font-medium text-[var(--color-text)]">{profile?.batch || '-'}</div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Date of Birth</label>
                <div className="text-sm font-medium text-[var(--color-text)]">{profile?.dob ? formatDate(profile.dob) : '-'}</div>
              </div>
            </div>
            
            <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
              These fields are managed by your programme office. Contact your admin if anything is incorrect.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Professional Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Current Role <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Senior Manager"
                  className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                  onBlur={validate}
                />
                {errors.currentRole && <span className="text-xs text-[var(--color-error)]">{errors.currentRole}</span>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Company <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Tata Consultancy Services"
                  className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  onBlur={validate}
                />
                {errors.company && <span className="text-xs text-[var(--color-error)]">{errors.company}</span>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Industry <span className="text-red-500">*</span></label>
              <select
                className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none bg-white"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                onBlur={validate}
              >
                <option value="" disabled>Select an industry...</option>
                <option value="Consulting">Consulting</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="FMCG">FMCG</option>
                <option value="Energy">Energy</option>
                <option value="Education">Education</option>
                <option value="Government">Government</option>
                <option value="Other">Other</option>
              </select>
              {errors.industry && <span className="text-xs text-[var(--color-error)]">{errors.industry}</span>}
            </div>

            <div>
              <label className="mb-1 flex justify-between text-sm font-medium text-[var(--color-text)]">
                <span>Work Experience Summary <span className="text-red-500">*</span></span>
                <span className="text-xs text-[var(--color-text-secondary)]">{formData.workExperience.length}/300</span>
              </label>
              <textarea
                placeholder="Brief summary of your professional background"
                className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none min-h-[100px] resize-none"
                maxLength={300}
                value={formData.workExperience}
                onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                onBlur={validate}
              />
              {errors.workExperience && <span className="text-xs text-[var(--color-error)]">{errors.workExperience}</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-70"
          >
            {loading ? 'Submitting...' : 'Enter Gurukul →'}
          </button>
        </form>
      </div>
    </div>
  );
}
