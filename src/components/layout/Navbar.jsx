import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, LayoutGrid, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@lib/cn';
import { APP_NAME } from '@lib/constants';
import { PRIMARY_TOOLS, TOOLS } from '@lib/tools';
import { Button, IconButton } from '@components/ui';
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

const ToolsMenu = ({ onNavigate }) => (
  <div className="grid gap-1 sm:w-[30rem] sm:grid-cols-2">
    {TOOLS.map((tool) => {
      const content = (
        <>
          <span className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md', tool.ready ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400')}>
            <tool.icon className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              {tool.name}
              {tool.ready ? null : <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Soon</span>}
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">{tool.tagline}</span>
          </span>
        </>
      );

      return (
        <Link key={tool.key} to={tool.path} onClick={onNavigate} className="flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-surface-muted">
          {content}
        </Link>
      );
    })}
  </div>
);

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, user, logout, isLoggingOut } = useAuth();

  useEffect(() => {
    setIsMobileOpen(false);
    setIsToolsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) setIsToolsOpen(false);
    };
    const onEscape = (event) => event.key === 'Escape' && setIsToolsOpen(false);
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

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="container-page flex h-16 items-center gap-3">
        <Link to={PATHS.home} aria-label={`${APP_NAME} home`}>
          <Wordmark />
        </Link>

        <div ref={toolsRef} className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setIsToolsOpen((open) => !open)}
            aria-expanded={isToolsOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
          >
            <LayoutGrid className="size-4" />
            Tools
            <ChevronDown className={cn('size-4 transition-transform', isToolsOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {isToolsOpen ? (
              <motion.div
                key="tools-menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-50 mt-2 rounded-xl border border-line bg-white p-2 shadow-xl"
              >
                <ToolsMenu onNavigate={() => setIsToolsOpen(false)} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {PRIMARY_TOOLS.map((tool) => (
            <NavLink
              key={tool.key}
              to={tool.path}
              className={({ isActive }) =>
                cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'text-brand-700' : 'text-slate-600 hover:bg-surface-muted hover:text-ink')
              }
            >
              {tool.name}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <NavLink
              to={PATHS.dashboard}
              className={({ isActive }) => cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'text-brand-700' : 'text-slate-600 hover:bg-surface-muted hover:text-ink')}
            >
              Workspace
            </NavLink>
          ) : null}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="max-w-[12rem] truncate text-sm text-slate-600">{user?.fullName ?? user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} isLoading={isLoggingOut} leftIcon={<LogOut className="size-4" />}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to={PATHS.login} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-muted">
                Log in
              </Link>
              <Button size="sm" onClick={() => navigate(PATHS.login)}>
                Get started
              </Button>
            </>
          )}
        </div>

        <IconButton label={isMobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setIsMobileOpen((open) => !open)} className="ml-auto md:hidden">
          {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </IconButton>
      </div>

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white md:hidden"
          >
            <div className="container-page flex flex-col gap-4 py-4">
              <ToolsMenu onNavigate={() => setIsMobileOpen(false)} />

              <div className="flex flex-col gap-2 border-t border-line pt-4">
                {isAuthenticated ? (
                  <>
                    <Link to={PATHS.dashboard} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-surface-muted">
                      Workspace
                    </Link>
                    <Button variant="outline" fullWidth onClick={handleLogout} isLoading={isLoggingOut} leftIcon={<LogOut className="size-4" />}>
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to={PATHS.login}
                      className="flex h-11 items-center justify-center rounded-lg border border-line text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
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
