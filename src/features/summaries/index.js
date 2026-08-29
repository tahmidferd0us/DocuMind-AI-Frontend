import { PATHS } from '@routes/paths';
import SummarizePage from './pages/SummarizePage';

export default { name: 'summaries', routes: [{ path: PATHS.summarize, Component: SummarizePage, layout: 'protected' }] };
