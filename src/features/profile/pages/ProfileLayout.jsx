import { NavLink, Outlet } from 'react-router-dom';
import { Activity, ArrowLeft, Lock, Sliders, User as UserIcon } from 'lucide-react';
import { Badge, Card } from '@components/ui';
import { cn } from '@lib/cn';
import { formatDate } from '@lib/format';
import { PATHS, PROFILE_SECTIONS } from '@routes/paths';
import { useAuth } from '@features/auth/useAuth';

const SECTION_ICONS = {
  general: UserIcon,
  security: Lock,
  preferences: Sliders,
  activity: Activity,
};

const getInitials = (name, email) => {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'U';
};

const ProfileLayout = () => {
  const { user } = useAuth();
  const initials = getInitials(user?.fullName, user?.email);

  return (
    <div className="container-page flex flex-col gap-6 py-8 sm:py-12">
      {/* Top back navigation & title */}
      <div>
        <NavLink
          to={PATHS.dashboard}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:text-brand-700 dark:hover:text-brand-400"
        >
          <ArrowLeft className="size-4" />
          Back to workspace
        </NavLink>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Account Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your personal details, credentials, processing defaults, and document activity.
        </p>
      </div>

      {/* User Header Summary Card */}
      <Card className="overflow-hidden border border-line bg-white dark:bg-slate-900 shadow-sm">
        <div className="bg-gradient-to-r from-brand-50/60 via-slate-50 to-white dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-xl font-bold text-white shadow-md ring-4 ring-white dark:ring-slate-800">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
                    {user?.fullName || 'DocuMind User'}
                  </h2>
                  <Badge tone={user?.role === 'ADMIN' ? 'brand' : 'neutral'}>
                    {user?.role ?? 'USER'}
                  </Badge>
                  <Badge tone="success">Active</Badge>
                </div>
                <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                {user?.createdAt && (
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Member since {formatDate(user.createdAt)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:self-center">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white dark:bg-slate-800 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 shadow-xs">
                <span className="size-2 rounded-full bg-emerald-500" />
                Verified Account
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Layout Grid with Side Menu on desktop / horizontal tabbar on mobile */}
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside>
          <Card className="sticky top-20 p-2">
            <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col" aria-label="Profile navigation">
              {PROFILE_SECTIONS.map((section) => {
                const Icon = SECTION_ICONS[section.key] ?? UserIcon;
                return (
                  <NavLink
                    key={section.key}
                    to={section.path}
                    end={section.segment === ''}
                    className={({ isActive }) =>
                      cn(
                        'flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/70 dark:text-brand-300'
                          : 'text-slate-600 hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:text-white',
                      )
                    }
                  >
                    <Icon className="size-4 shrink-0 text-slate-400" />
                    <span>{section.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </Card>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
