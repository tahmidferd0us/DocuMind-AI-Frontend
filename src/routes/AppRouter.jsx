import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AuthLayout from '@components/layout/AuthLayout';
import PublicLayout from '@components/layout/PublicLayout';
import { routesForLayout } from '@features/registry';
import ErrorPage from './ErrorPage';
import GuestRoute from './GuestRoute';
import NotFoundPage from './NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...routesForLayout('public'),
      { element: <ProtectedRoute />, children: routesForLayout('protected') },
      { path: '*', Component: NotFoundPage },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [{ element: <GuestRoute />, children: routesForLayout('guest') }],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
