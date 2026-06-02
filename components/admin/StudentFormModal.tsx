'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { toastSuccess, toastError } from '@/lib/toast';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { X, AlertTriangle } from 'lucide-react';
import { PROGRAMMES } from '@/constants/programmes';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  programme: z.enum(['IPMX', 'PGPSM', 'PGPWE', 'DGMP'] as any, { error: 'Programme is required' }),
  batch: z.string().min(1, 'Batch is required'),
  dob: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Valid Date of Birth is required' }),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  workExperience: z.string().max(300, 'Max 300 characters').optional(),
});

type FormData = z.infer<typeof formSchema>;

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student?: any; // If passed, it's edit mode
}

export function StudentFormModal({ isOpen, onClose, onSuccess, student }: StudentFormModalProps) {
  const isEdit = !!student;
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    programme: 'IPMX',
    batch: '2025',
    dob: '',
    currentRole: '',
    company: '',
    industry: '',
    workExperience: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        programme: student.profile?.programme || 'IPMX',
        batch: student.profile?.batch || '2025',
        dob: student.profile?.dob ? new Date(student.profile.dob).toISOString().split('T')[0] : '',
        currentRole: student.profile?.currentRole || '',
        company: student.profile?.company || '',
        industry: student.profile?.industry || '',
        workExperience: student.profile?.workExperience || '',
      });
      setErrors({});
    } else if (isOpen && !student) {
      setFormData({
        name: '',
        email: '',
        programme: 'IPMX',
        batch: '2025',
        dob: '',
        currentRole: '',
        company: '',
        industry: '',
        workExperience: '',
      });
      setErrors({});
    }
  }, [isOpen, student]);

  if (!isOpen) return null;

  const validateField = (field: keyof FormData, value: any) => {
    try {
      const fieldSchema = formSchema.shape[field];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.issues[0].message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = formSchema.parse(formData);

      if (isEdit) {
        const res = await fetch(`/api/admin/students/${student.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update', data: validatedData }),
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error?.message || 'Failed to update student');
        
        toastSuccess('Student updated.');
      } else {
        const res = await fetch(`/api/admin/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validatedData),
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error?.message || 'Failed to create student');
        
        toastSuccess(`Student created. Invite email sent to ${formData.email}.`);
      }

      onSuccess();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: any = {};
        error.issues.forEach((err: any) => {
          if (err.path[0]) newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        toastError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showEmailWarning = isEdit && formData.email !== student.email;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              {isEdit ? 'Edit Student' : 'Add Student'}
            </h2>
            {isEdit && (
              <div className="mt-1">
                <StatusBadge status={student.status} />
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {showEmailWarning && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Changing the email means this student must sign in with the new Google account on their next login.
              </p>
            </div>
          )}

          <form id="student-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-primary">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  onBlur={e => validateField('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.name ? 'border-red-500 outline-red-500' : 'border-border'}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-primary">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly={isEdit}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  onBlur={e => validateField('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${isEdit ? 'bg-surface cursor-not-allowed text-text-secondary' : ''} ${errors.email ? 'border-red-500 outline-red-500' : 'border-border'}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-primary">Programme <span className="text-red-500">*</span></label>
                <select
                  value={formData.programme}
                  onChange={e => setFormData({ ...formData, programme: e.target.value })}
                  onBlur={e => validateField('programme', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm bg-white ${errors.programme ? 'border-red-500 outline-red-500' : 'border-border'}`}
                >
                  {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.programme && <p className="text-xs text-red-500 mt-1">{errors.programme}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-primary">Batch <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.batch}
                  onChange={e => setFormData({ ...formData, batch: e.target.value })}
                  onBlur={e => validateField('batch', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.batch ? 'border-red-500 outline-red-500' : 'border-border'}`}
                />
                {errors.batch && <p className="text-xs text-red-500 mt-1">{errors.batch}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-primary">Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  onBlur={e => validateField('dob', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.dob ? 'border-red-500 outline-red-500' : 'border-border'}`}
                />
                {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
              </div>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Initial Profile Fields (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-primary">Current Role</label>
                  <input
                    type="text"
                    value={formData.currentRole}
                    onChange={e => setFormData({ ...formData, currentRole: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-primary">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-primary">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-white"
                  >
                    <option value="">Select Industry...</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Government">Government / Public Sector</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="FMCG">FMCG</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-text-primary">Work Experience Highlights</label>
                  <textarea
                    rows={3}
                    value={formData.workExperience}
                    onChange={e => setFormData({ ...formData, workExperience: e.target.value })}
                    onBlur={e => validateField('workExperience', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.workExperience ? 'border-red-500 outline-red-500' : 'border-border'}`}
                    placeholder="Brief summary of professional background..."
                  />
                  {errors.workExperience && <p className="text-xs text-red-500 mt-1">{errors.workExperience}</p>}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end gap-3 bg-surface">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-md bg-white hover:bg-surface/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="student-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Student & Send Invite'}
          </button>
        </div>
      </div>
    </div>
  );
}
