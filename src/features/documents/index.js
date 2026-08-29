import { PATHS } from '@routes/paths';
import DocumentOverviewPage from './pages/DocumentOverviewPage';
import DocumentWorkspace from './pages/DocumentWorkspace';

export default {
  name: 'documents',
  routes: [
    {
      path: PATHS.document,
      Component: DocumentWorkspace,
      layout: 'protected',
      withDocumentStages: true,
      children: [{ index: true, Component: DocumentOverviewPage }],
    },
  ],
};
