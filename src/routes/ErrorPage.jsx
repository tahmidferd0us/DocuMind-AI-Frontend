import { Link, useRouteError } from 'react-router-dom';
import { ThemeToggle } from '@components/ui';
import { PATHS } from './paths';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="relative min-h-dvh bg-surface">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <div className="container-page flex min-h-dvh flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">Unexpected error</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Something broke on this screen</h1>
        <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">{error?.statusText ?? error?.message ?? 'Reload the page, or head back home and try again.'}</p>
        <Link to={PATHS.home} className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
