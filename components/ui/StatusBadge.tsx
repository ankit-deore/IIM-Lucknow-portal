import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'ACTIVE' | 'DORMANT' | 'DEACTIVATED';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        {
          'bg-[#E8F5E9] text-[#2E7D32]': status === 'ACTIVE',
          'bg-[#FFF8E1] text-[#F57F17]': status === 'DORMANT',
          'bg-[#FFEBEE] text-[#C62828]': status === 'DEACTIVATED',
        },
        className
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}
