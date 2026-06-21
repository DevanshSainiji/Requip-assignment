import { cn } from '@/lib/utils';
import * as React from 'react';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconWrapperClass?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export function StatCard({ title, value, icon, iconWrapperClass, trend, subtitle, className, ...props }: StatCardProps) {
  return (
    <div className={cn("glass rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group", className)} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-heading font-bold text-slate-900">{value}</h3>
          </div>
          {(trend || subtitle) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    trend.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-slate-400">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-full shadow-sm", iconWrapperClass || "bg-slate-100 text-slate-600")}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
