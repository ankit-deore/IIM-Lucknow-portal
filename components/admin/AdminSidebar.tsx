'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Megaphone, 
  CalendarDays, 
  FolderOpen, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const mainNavItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { label: 'Timetable', href: '/admin/timetable', icon: CalendarDays },
  { label: 'Resources', href: '/admin/resources', icon: FolderOpen },
];

const secondaryNavItems = [
  { label: 'Audit Log', href: '/admin/audit-log', icon: ClipboardList },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 bg-[var(--color-primary)] flex flex-col z-20">
      {/* Header */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-2">
          <ChevronLeft size={18} />
          <span className="font-semibold text-[15px]">Admin Panel</span>
        </Link>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
            
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive
                  ? 'bg-white/10 text-white border-l-[3px] border-[var(--color-accent)] -ml-3 pl-[15px]'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}

        <div className="my-6 border-t border-white/10 mx-3" />

        {/* Secondary Navigation */}
        {secondaryNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive
                  ? 'bg-white/10 text-white border-l-[3px] border-[var(--color-accent)] -ml-3 pl-[15px]'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Sign out */}
      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="mb-3">
          <p className="text-xs text-white/50 truncate">
            {session?.user?.email}
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
