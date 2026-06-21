import { cn } from '@/lib/utils';
import * as React from 'react';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)} {...props}>
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-copper-50 text-copper-500 shadow-inner">
        <div className="absolute inset-0 rounded-full border-[6px] border-white/60"></div>
        <div className="absolute -inset-4 rounded-full border border-copper-100/50 bg-copper-50/20 -z-10"></div>
        {icon}
      </div>
      <h3 className="mt-6 font-heading text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
