import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

export function DashboardTimetable() {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 min-h-[200px] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-[18px] h-[18px] text-[var(--color-primary)]" />
          <h2 className="text-[16px] font-bold text-[var(--color-primary)]">
            Timetable
          </h2>
        </div>
        <Link 
          href="/timetable"
          className="text-[13px] text-[var(--color-primary)] hover:underline font-medium"
        >
          View all &rarr;
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 w-full">
          <CalendarDays className="w-10 h-10 text-[var(--color-text-secondary)] opacity-40 flex-shrink-0" />
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[16px] font-bold text-[var(--color-text-secondary)]">Your class schedule</h3>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1.5">
              Session details, venues, and calendar export
            </p>
            <span className="mt-3 inline-block bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] text-[12px] font-medium px-3 py-1 rounded-full w-fit">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
