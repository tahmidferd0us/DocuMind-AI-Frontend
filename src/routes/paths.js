export const PATHS = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  profile: '/profile',
  profileSecurity: '/profile/security',
  profilePreferences: '/profile/preferences',
  profileActivity: '/profile/activity',
  upload: '/upload',
  summarize: '/summarize',
  ask: '/ask',
  entities: '/entities',
  analytics: '/analytics',
  export: '/export',
  document: '/documents/:documentId',
  notFound: '*',
};

export const PROFILE_SECTIONS = [
  { key: 'general', label: 'General Profile', path: '/profile', segment: '' },
  { key: 'security', label: 'Security & Password', path: '/profile/security', segment: 'security' },
  { key: 'preferences', label: 'Preferences', path: '/profile/preferences', segment: 'preferences' },
  { key: 'activity', label: 'Activity & Usage', path: '/profile/activity', segment: 'activity' },
];


export const documentPath = (documentId, stage = '') => `/documents/${documentId}${stage ? `/${stage}` : ''}`;

export const DOCUMENT_STAGES = [
  { key: 'overview', label: 'Overview', segment: '', ready: true },
  { key: 'summary', label: 'Summary', segment: 'summary', ready: true },
  { key: 'ask', label: 'Ask', segment: 'ask', ready: true },
  { key: 'entities', label: 'Entities', segment: 'entities', ready: true },
  { key: 'export', label: 'Export', segment: 'export', ready: true },
];
