import { PATHS } from '@routes/paths';
import AskPage from './pages/AskPage';

export default { name: 'qa', routes: [{ path: PATHS.ask, Component: AskPage, layout: 'protected' }] };
