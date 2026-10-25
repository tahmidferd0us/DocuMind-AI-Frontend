import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Activity, ChevronDown, FileText, LayoutGrid, Lock, LogOut, Menu, ShieldCheck, Sliders, User as UserIcon, X } from 'lucide-react';
import { cn } from '@lib/cn';
import { APP_NAME } from '@lib/constants';
import { PRIMARY_TOOLS, TOOLS } from '@lib/tools';
import { Badge, Button, IconButton, ThemeToggle } from '@components/ui';
import { useAuth } from '@features/auth/useAuth';
import { useToast } from '@features/toast/useToast';
import { PATHS } from '@routes/paths';

const Wordmark = () => (
  <span className="flex items-center gap-2 font-semibold tracking-tight text-ink">
    <span className="grid size-8 shrink-0 grid-cols-2 gap-0.5 rounded-md p-1.5">
      <span className="rounded-[2px] bg-brand-600" />
      <span className="rounded-[2px] bg-emerald-500" />
      <span className="rounded-[2px] bg-amber-400" />
      <span className="rounded-[2px] bg-red-500" />
    </span>
    <span className="text-base sm:text-lg">{APP_NAME}</span>
  </span>
);

const getInitials = (name, email) => {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'U';
};

const ToolsMenu = ({ onNavigate }) => (
  <div className="grid gap-1 sm:w-[30rem] sm:grid-cols-2">
    {TOOLS.map((tool) => {
      const content = (
        <>
          <span
            className={cn(
              'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md',
              tool.ready
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/50 dark:text-brand-300'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
            )}
          >
            <tool.icon className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              {tool.name}
              {tool.ready ? null : (
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Soon
                </span>
              )}
            </span>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{tool.tagline}</span>
          </span>
        </>
      );

      return (
        <Link
          key={tool.key}
          to={tool.path}
          onClick={onNavigate}
          className="flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-surface-muted"
        >
          {content}
        </Link>
      );
    })}
  </div>
);

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const toolsRef = useRef(null);
  const profileRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, user, logout, isLoggingOut } = useAuth();

  useEffect(() => {
    setIsMobileOpen(false);
    setIsToolsOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) setIsToolsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setIsToolsOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.info('You have been signed out.');
    navigate(PATHS.login, { replace: true });
  };

  const initials = getInitials(user?.fullName, user?.email);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-slate-800">
      <div className="container-page flex h-16 items-center gap-3">
        <Link to={PATHS.home} aria-label={`${APP_NAME} home`}>
          <Wordmark />
        </Link>

        <div ref={toolsRef} className="relative hidden md:block">
          <button
            type="button"
            onClick={() => {
              setIsToolsOpen((open) => !open);
              setIsProfileOpen(false);
            }}
            aria-expanded={isToolsOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 rounded-lg border border-line bg-white dark:bg-slate-800 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-surface-muted dark:hover:bg-slate-700"
          >
            <LayoutGrid className="size-4 text-slate-500 dark:text-slate-400" />
            Tools
            <ChevronDown className={cn('size-4 text-slate-400 transition-transform', isToolsOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {isToolsOpen ? (
              <motion.div
                key="tools-menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-50 mt-2 rounded-xl border border-line bg-white p-2 shadow-xl dark:bg-slate-900 dark:border-slate-800"
              >
                <ToolsMenu onNavigate={() => setIsToolsOpen(false)} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {isAuthenticated ? (
            <>
              <NavLink
                to={PATHS.dashboard}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-white dark:ring-1 dark:ring-slate-700'
                      : 'text-slate-600 hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white',
                  )
                }
              >
                My documents
              </NavLink>
              {user?.role === 'ADMIN' && (
                <NavLink
                  to={PATHS.admin}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-slate-800 dark:text-brand-300 dark:ring-1 dark:ring-slate-700'
                        : 'text-brand-600 hover:bg-brand-50/40 dark:text-brand-400 dark:hover:bg-slate-800/60',
                    )
                  }
                >
                  <ShieldCheck className="size-4 text-brand-600 dark:text-brand-400" />
                  Admin Panel
                </NavLink>
              )}
              <NavLink
                to={PATHS.profile}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-white dark:ring-1 dark:ring-slate-700'
                      : 'text-slate-600 hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white',
                  )
                }
              >
                Profile &amp; Settings
              </NavLink>
            </>
          ) : (
            PRIMARY_TOOLS.map((tool) => (
              <NavLink
                key={tool.key}
                to={tool.path}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-white dark:ring-1 dark:ring-slate-700'
                      : 'text-slate-600 hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white',
                  )
                }
              >
                {tool.name}
              </NavLink>
            ))
          )}
        </nav>

        {/* Desktop actions: theme toggle + user profile / auth buttons */}
        <div className="ml-auto hidden items-center gap-2.5 md:flex">
          <ThemeToggle />

          {isAuthenticated ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen((open) => !open);
                  setIsToolsOpen(false);
                }}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                className="flex items-center gap-2.5 rounded-full border border-line bg-white dark:bg-slate-800 dark:border-slate-700 py-1 pl-1 pr-3 text-left transition-colors hover:bg-surface-muted dark:hover:bg-slate-700"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700 ring-1 ring-brand-200 dark:bg-brand-900/80 dark:text-brand-200 dark:ring-brand-700/60">
                  {initials}
                </div>
                <div className="max-w-[10rem] truncate text-xs font-medium text-slate-800 dark:text-slate-100">
                  {user?.fullName || user?.email}
                </div>
                <ChevronDown className={cn('size-3.5 text-slate-400 dark:text-slate-400 transition-transform', isProfileOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {isProfileOpen ? (
                  <motion.div
                    key="profile-dropdown"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-line bg-white p-2 shadow-xl dark:bg-slate-900 dark:border-slate-800"
                  >
                    {/* User summary in dropdown */}
                    <div className="border-b border-line px-3 pb-3 pt-2">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {user?.fullName || 'User Profile'}
                        </p>
                        <Badge tone={user?.role === 'ADMIN' ? 'brand' : 'neutral'} className="text-[10px]">
                          {user?.role ?? 'USER'}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
                    </div>

                    {user?.role === 'ADMIN' && (
                      <div className="border-b border-line py-1">
                        <Link
                          to={PATHS.admin}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-brand-700 bg-brand-50/70 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:bg-brand-900/40 dark:hover:bg-brand-900/60"
                        >
                          <ShieldCheck className="size-4 text-brand-600 dark:text-brand-400" />
                          <span>Admin Dashboard &amp; Analytics</span>
                        </Link>
                      </div>
                    )}

                    {/* Profile Subsections */}
                    <div className="py-1">
                      <Link
                        to={PATHS.profile}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:text-white"
                      >
                        <UserIcon className="size-4 text-slate-400" />
                        <span>General Profile</span>
                      </Link>
                      <Link
                        to={PATHS.profileSecurity}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:text-white"
                      >
                        <Lock className="size-4 text-slate-400" />
                        <span>Security &amp; Password</span>
                      </Link>
                      <Link
                        to={PATHS.profilePreferences}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:text-white"
                      >
                        <Sliders className="size-4 text-slate-400" />
                        <span>Preferences</span>
                      </Link>
                      <Link
                        to={PATHS.profileActivity}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:text-white"
                      >
                        <Activity className="size-4 text-slate-400" />
                        <span>Activity &amp; Usage</span>
                      </Link>
                    </div>

                    <div className="border-t border-line py-1">
                      <Link
                        to={PATHS.dashboard}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:text-white"
                      >
                        <FileText className="size-4 text-slate-400" />
                        <span>My documents</span>
                      </Link>
                    </div>

                    <div className="border-t border-line pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <LogOut className="size-4" />
                        <span>{isLoggingOut ? 'Signing out…' : 'Sign out'}</span>
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to={PATHS.login} className="rounded-lg border border-line bg-white dark:bg-slate-800 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-surface-muted dark:hover:bg-slate-700">
                Log in
              </Link>
              <Button size="sm" onClick={() => navigate(PATHS.login)}>
                Get started
              </Button>
            </>
          )}
        </div>

        {/* Mobile controls: Theme toggle + hamburger drawer button */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle size="sm" />
          <IconButton label={isMobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setIsMobileOpen((open) => !open)}>
            {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </IconButton>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white dark:bg-slate-900 md:hidden"
          >
            <div className="container-page flex flex-col gap-4 py-4">
              <ToolsMenu onNavigate={() => setIsMobileOpen(false)} />

              <div className="flex flex-col gap-2 border-t border-line pt-4">
                {isAuthenticated ? (
                  <>
                    {/* User info header for mobile */}
                    <div className="flex items-center gap-3 rounded-lg bg-surface-muted dark:bg-slate-800/80 p-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-brand-200 dark:bg-brand-900/80 dark:text-brand-200 dark:ring-brand-700/60">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {user?.fullName || 'User Profile'}
                          </p>
                          <Badge tone={user?.role === 'ADMIN' ? 'brand' : 'neutral'} className="text-[10px]">
                            {user?.role ?? 'USER'}
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <Link
                        to={PATHS.dashboard}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-surface-muted dark:text-slate-300 dark:hover:text-white"
                      >
                        <FileText className="size-4 text-slate-500" />
                        My documents
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link
                          to={PATHS.admin}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 bg-brand-50/70 hover:bg-brand-50 dark:text-brand-300 dark:bg-brand-900/40 dark:hover:bg-brand-900/60"
                        >
                          <ShieldCheck className="size-4 text-brand-600 dark:text-brand-400" />
                          Admin Dashboard &amp; Analytics
                        </Link>
                      )}
                      <Link
                        to={PATHS.profile}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-surface-muted dark:text-slate-300 dark:hover:text-white"
                      >
                        <UserIcon className="size-4 text-slate-500" />
                        General Profile
                      </Link>
                      <Link
                        to={PATHS.profileSecurity}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-surface-muted dark:text-slate-300 dark:hover:text-white"
                      >
                        <Lock className="size-4 text-slate-500" />
                        Security &amp; Password
                      </Link>
                      <Link
                        to={PATHS.profilePreferences}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-surface-muted dark:text-slate-300 dark:hover:text-white"
                      >
                        <Sliders className="size-4 text-slate-500" />
                        Preferences
                      </Link>
                      <Link
                        to={PATHS.profileActivity}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-surface-muted dark:text-slate-300 dark:hover:text-white"
                      >
                        <Activity className="size-4 text-slate-500" />
                        Activity &amp; Usage
                      </Link>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-line bg-surface-muted/60 p-2.5 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Theme</span>
                      <ThemeToggle showLabel size="sm" />
                    </div>

                    <div className="border-t border-line pt-2">
                      <Button variant="outline" fullWidth onClick={handleLogout} isLoading={isLoggingOut} leftIcon={<LogOut className="size-4" />}>
                        Sign out
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between rounded-lg border border-line bg-surface-muted/60 p-2.5 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Theme</span>
                      <ThemeToggle showLabel size="sm" />
                    </div>

                    <Link
                      to={PATHS.login}
                      className="flex h-11 items-center justify-center rounded-lg border border-line bg-white dark:bg-slate-800 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-surface-muted dark:hover:bg-slate-700"
                    >
                      Log in
                    </Link>
                    <Button fullWidth onClick={() => navigate(PATHS.login)}>
                      Get started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
