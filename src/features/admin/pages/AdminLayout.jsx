import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, FileText, ShieldCheck, Users } from 'lucide-react';
import { Badge, Card } from '@components/ui';
import { cn } from '@lib/cn';
import { ADMIN_SECTIONS } from '@routes/paths';
import { useAuth } from '@features/auth/useAuth';

const SECTION_ICONS = {
  overview: BarChart3,
  users: Users,
  documents: FileText,
};

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="container-page flex flex-col gap-6 py-8 sm:py-12">
      {/* Admin Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="brand" className="font-semibold uppercase tracking-wider text-[11px] gap-1 px-2.5 py-0.5">
              <ShieldCheck className="size-3.5" />
              Super Admin Console
            </Badge>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Platform
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Platform Administration</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time platform analytics, global user directories, document audits, and system infrastructure diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-slate-900">{user?.fullName || 'Super Administrator'}</p>
            <p className="text-[11px] text-slate-500">{user?.email}</p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-sm ring-2 ring-brand-100">
            <ShieldCheck className="size-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <Card className="p-1.5 shadow-xs">
        <nav className="flex flex-row gap-1 overflow-x-auto" aria-label="Admin Navigation Tabs">
          {ADMIN_SECTIONS.map((section) => {
            const Icon = SECTION_ICONS[section.key] ?? BarChart3;
            return (
              <NavLink
                key={section.key}
                to={section.path}
                end={section.segment === ''}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-surface-muted hover:text-ink',
                  )
                }
              >
                <Icon className="size-4 shrink-0" />
                <span>{section.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </Card>

      {/* Main Outlet */}
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
