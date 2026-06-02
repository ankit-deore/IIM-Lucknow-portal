import React from 'react';
import { Megaphone, Users, MessageSquare, FolderOpen, CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const FEATURES = [
  {
    title: 'Announcements',
    description: 'Programme updates in one authenticated feed — no more missed messages buried in WhatsApp groups.',
    icon: Megaphone,
    className: 'lg:col-span-2',
  },
  {
    title: 'Batch Directory',
    description: 'Discover your cohort. Browse profiles, backgrounds, and experience of everyone in your batch.',
    icon: Users,
    className: 'lg:col-span-2',
  },
  {
    title: 'Mock Interviews',
    description: 'Book peer-to-peer practice sessions with batchmates. Intra-batch matching, scheduling, and structured feedback — all in one place.',
    icon: MessageSquare,
    className: 'lg:col-span-2',
  },
  {
    title: 'Resources',
    description: 'Programme materials, case studies, and reading lists — organised by course and accessible instantly.',
    icon: FolderOpen,
    className: 'lg:col-span-2 lg:col-start-2',
  },
  {
    title: 'Timetable',
    description: 'Your live class schedule with session details, venue, and one-click export to Google Calendar or Apple Calendar.',
    icon: CalendarDays,
    className: 'lg:col-span-2 lg:col-start-4',
  },
];

export function FeatureGrid() {
  return (
    <section className="bg-[var(--color-bg-subtle)] py-16 md:py-24" id="features">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-[var(--color-accent)] text-[12px] tracking-[0.15em] uppercase font-bold mb-4">
            What&apos;s Inside
          </span>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[var(--color-text-primary)] leading-tight mb-4 tracking-tight">
            Everything your programme needs, in one place
          </h2>
          <p className="text-[18px] text-[var(--color-text-secondary)]">
            Gurukul brings together five modules built specifically for IIML&apos;s executive cohorts.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className={`flex flex-col h-full ${feature.className}`}>
                <div className="w-[48px] h-[48px] rounded-[var(--radius-md)] bg-[var(--color-primary-light)] flex items-center justify-center mb-6">
                  <Icon className="text-[var(--color-primary)] w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
