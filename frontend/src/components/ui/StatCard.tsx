import { cn } from '@/lib/utils';
import * as React from 'react';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon, trend, className, ...props }: StatCardProps) {
  return (
    <div className={cn("glass rounded-2xl p-6 transition-all duration-200 hover:shadow-lg", className)} {...props}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {icon && <div className="text-copper-500">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-3xl font-heading font-semibold text-slate-900">{value}</h3>
        {trend && (
          <span
            className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
