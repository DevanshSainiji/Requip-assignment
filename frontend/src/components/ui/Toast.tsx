/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-8 sm:right-8 sm:w-auto sm:flex-col">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500" />,
    info: <Info className="h-5 w-5 text-copper-500" />,
  };

  const bgs = {
    success: 'bg-white border-emerald-100',
    error: 'bg-white border-rose-100',
    info: 'bg-white border-copper-100',
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-md items-start gap-4 rounded-xl border p-4 shadow-lg transition-all animate-in slide-in-from-right-full sm:w-[350px]",
        bgs[toast.type]
      )}
    >
      <div className="shrink-0 pt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-slate-900">{toast.title}</p>
        {toast.message && <p className="text-sm text-slate-500">{toast.message}</p>}
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
