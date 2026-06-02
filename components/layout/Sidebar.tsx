'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShieldCheck, ChevronDown, ChevronRight, Megaphone, CalendarDays, FolderOpen } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

const commonNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Student Directory', href: '/directory', icon: Users },
];

const adminSubItems = [
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Timetable', href: '/admin/timetable', icon: CalendarDays },
  { label: 'Resources', href: '/admin/resources', icon: FolderOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin === true;
  
  const isAdminRoute = pathname.startsWith('/admin');
  const [isAdminOpen, setIsAdminOpen] = useState(isAdminRoute);

  useEffect(() => {
    if (isAdminRoute) {
      setIsAdminOpen(true);
    }
  }, [isAdminRoute]);

  return (
    <aside className="hidden h-screen w-[260px] flex-col bg-primary z-20 md:flex flex-shrink-0">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="relative w-10 h-10 shrink-0 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm">
          <Image
            src="/images/logo-iiml.png"
            alt="IIM Lucknow Logo"
            fill
            className="object-contain p-1"
          />
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight">Gurukul</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {commonNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive
                  ? 'bg-white/10 text-white border-l-4 border-accent -ml-3 pl-6'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <div className="mt-2">
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
                isAdminRoute && !isAdminOpen
                  ? 'bg-white/10 text-white border-l-4 border-accent -ml-3 pl-6'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">Admin Panel</span>
              </div>
              {isAdminOpen ? (
                <ChevronDown className="w-4 h-4 opacity-70" />
              ) : (
                <ChevronRight className="w-4 h-4 opacity-70" />
              )}
            </button>

            {isAdminOpen && (
              <div className="mt-1 flex flex-col gap-1 pl-4">
                {adminSubItems.map((subItem) => {
                  const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                  const SubIcon = subItem.icon;
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isSubActive
                          ? 'bg-white/10 text-white border-l-2 border-accent -ml-1 pl-3'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <SubIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium text-[13px]">{subItem.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
}
