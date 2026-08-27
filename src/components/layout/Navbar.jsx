import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Menu, Sparkles, X } from 'lucide-react';
import { cn } from '@lib/cn';
import { APP_NAME } from '@lib/constants';
import { Button, IconButton } from '@components/ui';
import { useAuth } from '@features/auth/useAuth';
import { useToast } from '@features/toast/useToast';
import { PATHS } from '@routes/paths';

const NAV_LINKS = [
  { label: 'Home', to: PATHS.home },
  { label: 'How it works', to: `${PATHS.home}#how-it-works` },
  { label: 'Dashboard', to: PATHS.dashboard, authOnly: true },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, user, logout, isLoggingOut } = useAuth();

  useEffect(() => setIsOpen(false), [pathname]);

  const visibleLinks = NAV_LINKS.filter((link) => !link.authOnly || isAuthenticated);

  const handleLogout = async () => {
    await logout();
    toast.info('You have been signed out.');
    navigate(PATHS.login, { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to={PATHS.home} className="flex items-center gap-2 font-semibold tracking-tight text-slate-900">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Sparkles className="size-4" />
          </span>
          <span className="text-base sm:text-lg">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === PATHS.home}
              className={({ isActive }) =>
                cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="max-w-[14rem] truncate text-sm text-slate-600">{user?.fullName ?? user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} isLoading={isLoggingOut} leftIcon={<LogOut className="size-4" />}>
                Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate(PATHS.login)}>
              Sign in
            </Button>
          )}
        </div>

        <IconButton label={isOpen ? 'Close menu' : 'Open menu'} onClick={() => setIsOpen((value) => !value)} className="md:hidden">
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </IconButton>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white md:hidden"
          >
            <nav className="container-page flex flex-col gap-1 py-4">
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === PATHS.home}
                  className={({ isActive }) =>
                    cn('rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100')
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="mt-3 border-t border-line pt-3">
                {isAuthenticated ? (
                  <Button variant="outline" fullWidth onClick={handleLogout} isLoading={isLoggingOut} leftIcon={<LogOut className="size-4" />}>
                    Sign out
                  </Button>
                ) : (
                  <Button fullWidth onClick={() => navigate(PATHS.login)}>
                    Sign in
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
