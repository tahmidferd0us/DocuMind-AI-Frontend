import { PATHS } from '@routes/paths';
import HomePage from './pages/HomePage';

export default { name: 'home', routes: [{ path: PATHS.home, Component: HomePage, layout: 'public' }] };
