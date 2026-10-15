import { PATHS } from '@routes/paths';
import AdminLayout from './pages/AdminLayout';
import AdminOverviewPage from './pages/AdminOverviewPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminDocumentsPage from './pages/AdminDocumentsPage';

export default {
  name: 'admin',
  routes: [
    {
      path: PATHS.admin,
      Component: AdminLayout,
      layout: 'admin',
      children: [
        { index: true, Component: AdminOverviewPage },
        { path: 'analytics', Component: AdminOverviewPage },
        { path: 'users', Component: AdminUsersPage },
        { path: 'documents', Component: AdminDocumentsPage },
      ],
    },
    {
      path: PATHS.analytics,
      Component: AdminLayout,
      layout: 'admin',
      children: [{ index: true, Component: AdminOverviewPage }],
    },
  ],
};
