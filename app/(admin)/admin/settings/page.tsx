'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function SettingsAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Admin Settings</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Manage portal configuration and administrative access.</p>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]">Admin Accounts</h2>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">Manage users who have full administrative access to the portal.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Add Admin
          </button>
        </div>
        
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Admin Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                  Superadmin placeholder
                </td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">ADMIN</td>
                <td className="px-6 py-4">
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-lg p-12 text-center shadow-sm">
        <p className="text-[var(--color-text-secondary)] text-sm">
          Other settings coming soon.
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Add New Admin</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Enter the email address of the user you want to grant admin access to.</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. professor@iiml.ac.in"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] rounded-md transition-colors"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
