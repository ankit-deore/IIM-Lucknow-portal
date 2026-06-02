import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-sm)]',
        'transition-all duration-150 ease-in-out',
        'hover:shadow-[var(--shadow-md)] hover:border-[var(--color-primary-light)] hover:-translate-y-[2px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
