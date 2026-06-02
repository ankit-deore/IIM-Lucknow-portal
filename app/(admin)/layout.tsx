import { Sidebar } from '@/components/layout/Sidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { getSessionOrThrow, requireAdmin } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionResult = await getSessionOrThrow();
  if ('error' in sessionResult || !sessionResult) {
    redirect('/');
  }

  const access = requireAdmin(sessionResult);
  if (access !== true) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
