import { Link } from 'react-router-dom';
import { PATHS } from './paths';

const NotFoundPage = () => (
  <div className="container-page flex flex-col items-center justify-center gap-4 py-24 text-center sm:py-32">
    <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">404</p>
    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">This page does not exist</h1>
    <p className="max-w-md text-sm text-slate-500">The link may be broken, or the page may have been moved.</p>
    <Link to={PATHS.home} className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700">
      Back to home
    </Link>
  </div>
);

export default NotFoundPage;
