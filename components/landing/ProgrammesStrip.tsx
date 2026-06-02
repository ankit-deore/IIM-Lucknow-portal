import React from 'react';

const PROGRAMMES = ['IPMX', 'PGPSM', 'PGPWE', 'DGMP'];

export function ProgrammesStrip() {
  return (
    <section className="bg-[var(--color-primary)] py-8 border-y border-[rgba(255,255,255,0.1)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center relative">
          
          {/* Label (absolute left on desktop, centered top on mobile) */}
          <div className="md:absolute md:left-0 mb-4 md:mb-0 flex items-center">
            <span className="text-[var(--color-accent)] text-[13px] tracking-[0.1em] uppercase font-semibold">
              Serving
            </span>
            <div className="hidden md:block w-8 h-[1px] bg-[var(--color-accent)] ml-4 opacity-50" />
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {PROGRAMMES.map((prog) => (
              <div 
                key={prog}
                className="rounded-[var(--radius-full)] border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.08)] text-[var(--color-text-inverse)] text-[14px] px-5 py-2 font-medium"
              >
                {prog}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
