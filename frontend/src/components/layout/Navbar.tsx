import { Menu, Search, Bell, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left side: Mobile menu & Brand placeholder (if sidebar hidden) */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="lg:hidden font-heading text-xl font-bold text-copper-600 tracking-tight">
            Requip.
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex relative w-64">
            <Input
              type="text"
              placeholder="Search users, email, mobile..."
              leftIcon={<Search className="h-4 w-4" />}
              rightIcon={<kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-400">/</kbd>}
              className="h-10 rounded-xl bg-slate-100/50 border border-slate-200 transition-all hover:bg-slate-100 hover:border-slate-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-copper-500/20 focus-visible:border-copper-500 shadow-sm"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
            <Bell className="h-5 w-5 text-slate-500" />
          </Button>

          <div className="h-8 w-8 rounded-full bg-copper-100 border border-copper-200 flex items-center justify-center cursor-pointer hover:bg-copper-200 transition-colors">
            <UserIcon className="h-4 w-4 text-copper-600" />
          </div>
        </div>

      </div>
    </header>
  );
}
