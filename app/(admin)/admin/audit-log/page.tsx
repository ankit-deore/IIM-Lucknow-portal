'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function AuditLogAdminPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-log')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.logs) {
          setLogs(data.data.logs);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Audit Log</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Review the last 50 administrative actions.</p>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Entity Type</th>
              <th className="px-6 py-4 font-medium">Performed By</th>
              <th className="px-6 py-4 font-medium">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[var(--color-text-secondary)]">
                  No admin activity recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                    {log.action.replace(/_/g, ' ')}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                    <span className="bg-[var(--color-bg-subtle)] px-2 py-1 rounded text-xs font-medium border border-[var(--color-border)]">
                      {log.entityType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                    {log.adminEmail}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)] whitespace-nowrap">
                    {format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
