export const PATHS = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  upload: '/upload',
  summarize: '/summarize',
  ask: '/ask',
  entities: '/entities',
  analytics: '/analytics',
  export: '/export',
  document: '/documents/:documentId',
  notFound: '*',
};

export const documentPath = (documentId, stage = '') => `/documents/${documentId}${stage ? `/${stage}` : ''}`;

export const DOCUMENT_STAGES = [
  { key: 'overview', label: 'Overview', segment: '', ready: true },
  { key: 'summary', label: 'Summary', segment: 'summary', ready: true },
  { key: 'ask', label: 'Ask', segment: 'ask', ready: true },
  { key: 'entities', label: 'Entities', segment: 'entities', ready: false },
  { key: 'export', label: 'Export', segment: 'export', ready: false },
];
