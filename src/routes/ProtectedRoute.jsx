import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '@components/ui';
import { useAuth } from '@features/auth/useAuth';
import { PATHS } from './paths';

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, isBootstrapped, user } = useAuth();
  const location = useLocation();

  if (!isBootstrapped) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to={PATHS.login} state={{ from: location.pathname }} replace />;
  if (roles?.length && !roles.includes(user?.role)) return <Navigate to={PATHS.home} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
