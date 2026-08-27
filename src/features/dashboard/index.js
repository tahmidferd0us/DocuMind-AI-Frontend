import { PATHS } from '@routes/paths';
import DashboardPage from './pages/DashboardPage';

export default { name: 'dashboard', routes: [{ path: PATHS.dashboard, Component: DashboardPage, layout: 'protected' }] };
