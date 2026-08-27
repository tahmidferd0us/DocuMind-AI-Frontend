import { TOOLS } from '@lib/tools';
import { createToolPage } from './pages/ToolPage';

export default {
  name: 'tools',
  routes: TOOLS.map((tool) => ({ path: tool.path, Component: createToolPage(tool.key), layout: 'public' })),
};
