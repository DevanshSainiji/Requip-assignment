import { NavLink } from 'react-router-dom';
import { Users, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ className }: { className?: string }) {
  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className={cn("flex flex-col border-r border-slate-200 bg-white shadow-soft", className)}>
      {/* Brand logo */}
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900">
          Re<span className="text-copper-500">quip.</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-copper-50 text-copper-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Profile mini */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-medium text-sm">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">Admin</span>
            <span className="text-xs text-slate-500">admin@requip.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
