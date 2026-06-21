import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100';
    
    const variants = {
      primary: 'bg-copper-500 text-white hover:bg-copper-600 shadow-sm focus-visible:ring-copper-500',
      secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus-visible:ring-slate-900',
      outline: 'border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900 focus-visible:ring-slate-500',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus-visible:ring-slate-500',
      danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm focus-visible:ring-rose-500',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
