import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  iconColorClass: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, iconColorClass }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <div className={`p-2 rounded-md bg-opacity-10 ${iconColorClass.replace('text-', 'bg-')}`}>
          <Icon className={`w-5 h-5 ${iconColorClass}`} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-primary">{value}</p>
        <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
