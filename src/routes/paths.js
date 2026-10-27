export const PATHS = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  admin: '/admin',
  adminAnalytics: '/admin/analytics',
  adminUsers: '/admin/users',
  adminDocuments: '/admin/documents',
  profile: '/profile',
  profileSecurity: '/profile/security',
  profilePreferences: '/profile/preferences',
  profileActivity: '/profile/activity',
  profileBilling: '/profile/billing',
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
  { key: 'billing', label: 'Subscription & Billing', path: '/profile/billing', segment: 'billing' },
];

export const ADMIN_SECTIONS = [
  { key: 'overview', label: 'Platform Analytics', path: '/admin', segment: '' },
  { key: 'users', label: 'User Directory', path: '/admin/users', segment: 'users' },
  { key: 'documents', label: 'Platform Documents', path: '/admin/documents', segment: 'documents' },
];


export const documentPath = (documentId, stage = '') => `/documents/${documentId}${stage ? `/${stage}` : ''}`;

export const DOCUMENT_STAGES = [
  { key: 'overview', label: 'Overview', segment: '', ready: true },
  { key: 'summary', label: 'Summary', segment: 'summary', ready: true },
  { key: 'ask', label: 'Ask', segment: 'ask', ready: true },
  { key: 'entities', label: 'Entities', segment: 'entities', ready: true },
  { key: 'analytics', label: 'Analytics', segment: 'analytics', ready: true },
  { key: 'export', label: 'Export', segment: 'export', ready: true },
];
