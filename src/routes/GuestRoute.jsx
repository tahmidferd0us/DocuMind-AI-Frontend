import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@components/ui';
import { useAuth } from '@features/auth/useAuth';
import { PATHS } from './paths';

const GuestRoute = () => {
  const { isAuthenticated, isBootstrapped } = useAuth();

  if (!isBootstrapped) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to={PATHS.dashboard} replace /> : <Outlet />;
};

export default GuestRoute;
