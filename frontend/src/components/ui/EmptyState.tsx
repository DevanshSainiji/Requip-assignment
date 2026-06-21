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
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-copper-50 text-copper-500">
        {icon}
      </div>
      <h3 className="mt-6 font-heading text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
