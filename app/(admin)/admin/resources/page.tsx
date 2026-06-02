'use client';

import { Plus } from 'lucide-react';

export default function ResourcesAdminPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Resource Manager</h1>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-medium">
          <Plus size={16} />
          Add Resource
        </button>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-lg p-12 text-center shadow-sm">
        <p className="text-[var(--color-text-secondary)] text-lg">
          Resource manager coming soon.
        </p>
      </div>
    </div>
  );
}
